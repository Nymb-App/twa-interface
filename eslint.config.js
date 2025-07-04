//  @ts-check

import { tanstackConfig } from '@tanstack/eslint-config'
import unusedImports from 'eslint-plugin-unused-imports'

export default [
  ...tanstackConfig,
  {
    plugins: {
      'unused-imports': unusedImports,
    },
    rules: {
      // Автоматически удаляет неиспользуемые импорты
      'unused-imports/no-unused-imports': 'error',

      // Также удаляет неиспользуемые переменные (если нужно)
      // 'unused-imports/no-unused-vars': [
      //   'warn',
      //   {
      //     vars: 'all',
      //     varsIgnorePattern: '^_', // переменные, начинающиеся с _ — игнорируются
      //     args: 'after-used',
      //     argsIgnorePattern: '^_',
      //   },
      // ],
    },
  },
]
