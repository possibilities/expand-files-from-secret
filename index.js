const { mkdirs, writeFile } = require('fs-extra')
const { join: joinPath, dirname: dirnameOfPath } = require('path')
const kubernetesClient = require('kube-client')
const findConfig = require('kube-client/findConfig')

const filesSecretName = process.env.FILES_SECRET_NAME
const namespace = process.env.NAMESPACE
const rootPath = process.cwd()

const decode = encoded => Buffer.from(encoded, 'base64').toString()

const run = async () => {
  const config = await findConfig()
  const kubernetes = await kubernetesClient({ ...config, namespace })
  const filesSecret = await kubernetes.api.v1.secrets.get(filesSecretName)

  const files = JSON.parse(decode(filesSecret.data.files))
  return Promise.all(files.map(async file => {
    const path = joinPath(rootPath, file.path)
    await mkdirs(dirnameOfPath(path))
    await writeFile(path, decode(file.content))
  }))
}

run()
