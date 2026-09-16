import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages のプロジェクトページは https://<ユーザー名>.github.io/<リポジトリ名>/
// というサブパスで配信されるため、base にリポジトリ名を入れる。
// リポジトリ名を変えたときは、ここも合わせて変える。
const REPOSITORY_NAME = 'care-client-ledger'

export default defineConfig(({ command }) => ({
  plugins: [react()],
  // 開発サーバーは http://localhost:5173/ で動かすのでサブパスを付けない
  base: command === 'build' ? '/' + REPOSITORY_NAME + '/' : '/',
}))
