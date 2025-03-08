import { convertToBase64 } from '../utils'
import { Cache } from './cache.ts'

const githubRawURL = 'https://raw.githubusercontent.com'
const githubAPIURL = 'https://api.github.com'
const cacheSize = 50
const cache = new Cache(cacheSize)

export function getImageURL(repo: string, filename: string): string {
  return `${githubRawURL}/${repo}/main/${filename}`
}

export async function checkRepo(repo: string, token: string) {
  if (!token || !repo) {
    throw new Error('请先完成 GitHub 配置')
  }
  try {
    const response = await fetch(`${githubAPIURL}/repos/${repo}`, {
      headers: {
        Authorization: `token ${token}`,
        Accept: 'application/vnd.github.v3+json',
      },
    })
    return response.status === 200
  }
  catch (error) {
    console.error(error)
    return false
  }
}

export async function createRepo(repo: string, token: string) {
  if (!token || !repo) {
    throw new Error('请先完成 GitHub 配置')
  }

  const [_, repoName] = repo.split('/')

  try {
    const response = await fetch(`${githubAPIURL}/user/repos`, {
      method: 'POST',
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: repoName,
        private: false,
        auto_init: true,
        description: 'Easy GitHub Image Repo',
      }),
    })
    return await response.json()
  }
  catch (error) {
    console.error(error)
  }
}

export async function uploadImage(file: File, path: string, repo: string, token: string) {
  if (!token || !repo) {
    throw new Error('请先完成 GitHub 配置')
  }

  // 检查仓库是否存在，不存在则创建
  const result = await checkRepo(repo, token)
  if (!result) {
    await createRepo(repo, token)
  }

  const base64Content = await convertToBase64(file)
  const response = await fetch(`${githubAPIURL}/repos/${repo}/contents/${path}`, {
    method: 'PUT',
    headers: {
      'Authorization': `token ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: `upload ${file.name}`,
      content: base64Content,
    }),
  })

  if (!response.ok) {
    throw new Error('上传失败')
  }

  return await response.json()
}

export async function getCommitDetail(sha: string, repo: string, token: string) {
  const cacheData = cache.get(sha)
  if (cacheData) {
    return JSON.parse(cacheData)
  }
  const response = await fetch(
    `${githubAPIURL}/repos/${repo}/commits/${sha}`,
    {
      headers: {
        Authorization: `token ${token}`,
        Accept: 'application/vnd.github.v3+json',
      },
    },
  )
  if (!response.ok) {
    throw new Error('获取提交详情失败')
  }
  const data = await response.json()
  cache.put(sha, JSON.stringify(data))
  return data
}

export interface ImageItem {
  path: string
  sha: string
  rawURL: string
  commitDate: Date
}

export async function getImageList(repo: string, token: string) {
  if (!token || !repo) {
    throw new Error('请先完成 GitHub 配置')
  }

  try {
    // 获取最近的提交记录
    const commitsResponse = await fetch(
      `https://api.github.com/repos/${repo}/commits?per_page=20`,
      {
        headers: {
          Authorization: `token ${token}`,
          Accept: 'application/vnd.github.v3+json',
        },
      },
    )

    const commits = await commitsResponse.json()
    const imageMap: Map<string, ImageItem> = new Map()

    // 遍历每个提交
    for (const commit of commits) {
      try {
        const commitDetail = await getCommitDetail(commit.sha, repo, token)
        const files = commitDetail.files || []
        // 处理这个提交中的文件
        for (const file of files) {
          if (file.status !== 'removed'
            && file.filename
            && file.filename.startsWith('images/')
            && /\.(?:jpg|jpeg|png|gif|webp)$/i.test(file.filename)) {
            if (!imageMap.has(file.filename)
              || imageMap.get(file.filename)?.sha !== file.sha) {
              imageMap.set(file.filename, {
                path: file.filename,
                sha: file.sha,
                rawURL: getImageURL(repo, file.filename),
                commitDate: new Date(commit.commit.author.date),
              })
            }
          }
        }

        if (imageMap.size >= 20)
          break
      }
      catch (error) {
        console.error(error)
      }
    }

    return Array.from(imageMap.values())
      .sort((a, b) => Number(b.commitDate) - Number(a.commitDate))
      .slice(0, 50)
  }
  catch (error) {
    console.error(error)
  }
}
