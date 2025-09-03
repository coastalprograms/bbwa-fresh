#!/usr/bin/env node

/**
 * BBWA Environment Validation Script
 * 
 * Validates environment configuration and provides helpful setup guidance.
 * Run with: npm run env:validate
 * 
 * Exit codes:
 * - 0: All critical variables set and valid
 * - 1: Missing critical variables (app won't start)
 * - 2: Missing important variables (features disabled)
 */

const fs = require('fs')
const path = require('path')
const crypto = require('crypto')

// Color output utilities
const colors = {
  red: (text) => `\x1b[31m${text}\x1b[0m`,
  green: (text) => `\x1b[32m${text}\x1b[0m`,
  yellow: (text) => `\x1b[33m${text}\x1b[0m`,
  blue: (text) => `\x1b[34m${text}\x1b[0m`,
  cyan: (text) => `\x1b[36m${text}\x1b[0m`,
  gray: (text) => `\x1b[90m${text}\x1b[0m`,
  bold: (text) => `\x1b[1m${text}\x1b[0m`,
}

// Environment variable definitions with validation
const ENV_SCHEMA = {
  // Critical - App won't start without these
  critical: {
    'NEXT_PUBLIC_SUPABASE_URL': {
      description: 'Supabase project URL',
      example: 'https://your-project.supabase.co',
      validate: (val) => val && val.startsWith('https://') && val.includes('.supabase.co'),
      setup: 'Get from your Supabase project dashboard'
    },
    'NEXT_PUBLIC_SUPABASE_ANON_KEY': {
      description: 'Supabase anonymous key (or use PUBLISHABLE_KEY)',
      example: 'eyJhbGciOi...',
      validate: (val) => val && val.startsWith('eyJ'),
      setup: 'Get from Supabase > Settings > API > anon/public key',
      alternative: 'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY'
    },
    'SUPABASE_SERVICE_ROLE_KEY': {
      description: 'Supabase service role key (server-only)',
      example: 'eyJhbGciOi...',
      validate: (val) => val && val.startsWith('eyJ'),
      setup: 'Get from Supabase > Settings > API > service_role key',
      security: 'NEVER expose this to the client'
    },
    'SESSION_SECRET': {
      description: 'Session signing secret (64 hex chars)',
      example: 'a1b2c3d4e5f6...',
      validate: (val) => val && /^[a-f0-9]{64}$/.test(val),
      setup: 'Generate with: openssl rand -hex 32'
    }
  },

  // Important - Features disabled without these
  important: {
    'NEXT_PUBLIC_GOOGLE_MAPS_API_KEY': {
      description: 'Google Maps API key for service area maps',
      example: 'AIzaSy...',
      validate: (val) => val && val.startsWith('AIza'),
      setup: 'Get from Google Cloud Console > APIs & Services > Credentials',
      impact: 'Service area maps will not load'
    },
    'AI_PROVIDER': {
      description: 'AI provider for project descriptions',
      example: 'gemini',
      validate: (val) => !val || ['gemini', 'openai'].includes(val),
      setup: 'Set to "gemini" (recommended) or "openai"',
      impact: 'AI project generation disabled'
    },
    'GEMINI_API_KEY': {
      description: 'Gemini API key (if using AI_PROVIDER=gemini)',
      example: 'AIzaSy...',
      validate: (val) => !val || val.startsWith('AIza'),
      setup: 'Get from Google AI Studio (makersuite.google.com)',
      condition: (env) => env.AI_PROVIDER === 'gemini' || !env.AI_PROVIDER,
      impact: 'AI project generation disabled'
    },
    'OPENAI_API_KEY': {
      description: 'OpenAI API key (if using AI_PROVIDER=openai)',
      example: 'sk-...',
      validate: (val) => !val || val.startsWith('sk-'),
      setup: 'Get from OpenAI Platform (platform.openai.com)',
      condition: (env) => env.AI_PROVIDER === 'openai',
      impact: 'AI project generation disabled'
    }
  },

  // Optional - Graceful fallbacks exist
  optional: {
    'AUTOMATION_WEBHOOK_URL': {
      description: 'Webhook URL for compliance alerts',
      example: 'https://hook.make.com/...',
      validate: (val) => !val || val.startsWith('https://'),
      setup: 'Set up Make.com or n8n webhook',
      fallback: 'Compliance alerts logged only'
    },
    'AUTOMATION_WEBHOOK_SECRET': {
      description: 'Webhook HMAC secret (32+ chars)',
      example: 'your-secret-key...',
      validate: (val) => !val || val.length >= 32,
      setup: 'Generate with: openssl rand -hex 32',
      fallback: 'Webhook security disabled'
    },
    'AIRTABLE_API_KEY': {
      description: 'Airtable API key for dynamic content',
      example: 'pat...',
      validate: (val) => !val || val.startsWith('pat') || val.startsWith('key'),
      setup: 'Create personal access token at airtable.com',
      fallback: 'Uses local Supabase FAQ table'
    }
  }
}

function loadEnvironment() {
  // Try to load .env.local first, then .env
  const envPaths = ['.env.local', '.env']
  let env = { ...process.env }
  
  for (const envFile of envPaths) {
    if (fs.existsSync(envFile)) {
      console.log(colors.gray(`Loading ${envFile}...`))
      const content = fs.readFileSync(envFile, 'utf8')
      
      // Simple .env parser
      content.split('\n').forEach(line => {
        line = line.trim()
        if (line && !line.startsWith('#') && line.includes('=')) {
          const [key, ...valueParts] = line.split('=')
          const value = valueParts.join('=').trim()
          if (value && !env[key.trim()]) {
            env[key.trim()] = value
          }
        }
      })
      break
    }
  }
  
  return env
}

function validateVariable(key, config, env, severity) {
  const value = env[key]
  const hasValue = value && value.length > 0
  const isValid = hasValue && config.validate(value)
  const isRequired = !config.condition || config.condition(env)
  
  let status = 'ok'
  let message = ''
  
  if (!hasValue) {
    if (isRequired && severity === 'critical') {
      status = 'error'
      message = 'Missing (required)'
    } else if (isRequired && severity === 'important') {
      status = 'warning'
      message = 'Missing (feature disabled)'
    } else if (!isRequired) {
      status = 'skip'
      message = 'Not needed for current config'
    } else {
      status = 'info'
      message = 'Not set (optional)'
    }
  } else if (!isValid) {
    status = 'error'
    message = 'Invalid format'
  } else {
    status = 'ok'
    message = hasValue ? 'Set and valid' : 'Valid'
  }
  
  return { status, message, hasValue, isValid, isRequired }
}

function printValidationResult(key, config, result, severity) {
  const severityColors = {
    critical: colors.red,
    important: colors.yellow,
    optional: colors.cyan
  }
  
  const statusSymbols = {
    ok: colors.green('✓'),
    error: colors.red('✗'),
    warning: colors.yellow('⚠'),
    info: colors.gray('○'),
    skip: colors.gray('—')
  }
  
  const severityLabel = severityColors[severity](severity.toUpperCase())
  const statusSymbol = statusSymbols[result.status]
  const keyLabel = colors.bold(key)
  
  console.log(`${statusSymbol} [${severityLabel}] ${keyLabel}`)
  console.log(`    ${result.message}`)
  
  if (!result.hasValue || !result.isValid) {
    console.log(colors.gray(`    → ${config.description}`))
    console.log(colors.gray(`    → Example: ${config.example}`))
    console.log(colors.gray(`    → Setup: ${config.setup}`))
    
    if (config.security) {
      console.log(colors.red(`    ⚠  Security: ${config.security}`))
    }
    
    if (config.impact && result.status !== 'skip') {
      console.log(colors.yellow(`    → Impact: ${config.impact}`))
    }
    
    if (config.fallback && result.status !== 'skip') {
      console.log(colors.cyan(`    → Fallback: ${config.fallback}`))
    }
    
    if (config.alternative && result.status === 'error') {
      console.log(colors.blue(`    → Alternative: Use ${config.alternative}`))
    }
  }
  
  console.log('')
}

function generateSetupCommands(env) {
  const commands = []
  
  if (!env.SESSION_SECRET) {
    commands.push({
      description: 'Generate session secret',
      command: 'openssl rand -hex 32',
      variable: 'SESSION_SECRET'
    })
  }
  
  if (!env.AUTOMATION_WEBHOOK_SECRET) {
    commands.push({
      description: 'Generate webhook secret',
      command: 'openssl rand -hex 32',
      variable: 'AUTOMATION_WEBHOOK_SECRET'
    })
  }
  
  return commands
}

function printSetupCommands(commands) {
  if (commands.length === 0) return
  
  console.log(colors.bold('\n📋 QUICK SETUP COMMANDS'))
  console.log(colors.gray('Run these commands to generate required secrets:\n'))
  
  commands.forEach(({ description, command, variable }) => {
    console.log(colors.cyan(description))
    console.log(colors.gray(`${variable}=$(${command})`))
    console.log(`echo "${variable}=$(${command})" >> .env.local`)
    console.log('')
  })
}

function printSummary(results) {
  const counts = {
    critical: { total: 0, missing: 0, invalid: 0 },
    important: { total: 0, missing: 0, invalid: 0 },
    optional: { total: 0, missing: 0, invalid: 0 }
  }
  
  Object.entries(results).forEach(([severity, vars]) => {
    Object.entries(vars).forEach(([key, result]) => {
      counts[severity].total++
      if (!result.hasValue && result.isRequired) {
        counts[severity].missing++
      }
      if (result.hasValue && !result.isValid) {
        counts[severity].invalid++
      }
    })
  })
  
  console.log(colors.bold('\n📊 VALIDATION SUMMARY'))
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  
  Object.entries(counts).forEach(([severity, count]) => {
    const severityColors = {
      critical: colors.red,
      important: colors.yellow,
      optional: colors.cyan
    }
    
    const issues = count.missing + count.invalid
    const status = issues === 0 ? colors.green('✓') : colors.red('✗')
    
    console.log(`${status} ${severityColors[severity](severity.toUpperCase())}: ${count.total - issues}/${count.total} configured`)
    
    if (count.missing > 0) {
      console.log(`    Missing: ${count.missing}`)
    }
    if (count.invalid > 0) {
      console.log(`    Invalid: ${count.invalid}`)
    }
  })
  
  const criticalIssues = counts.critical.missing + counts.critical.invalid
  const importantIssues = counts.important.missing + counts.important.invalid
  
  console.log('')
  
  if (criticalIssues > 0) {
    console.log(colors.red('🚨 CRITICAL ISSUES: App will not start'))
    console.log(colors.red(`Fix ${criticalIssues} critical variable(s) before running the app`))
    return 1
  } else if (importantIssues > 0) {
    console.log(colors.yellow('⚠️  IMPORTANT ISSUES: Some features disabled'))
    console.log(colors.yellow(`${importantIssues} important variable(s) missing - app will start with limited functionality`))
    return 2
  } else {
    console.log(colors.green('🎉 ALL CRITICAL VARIABLES CONFIGURED'))
    console.log(colors.green('Your environment is ready for development!'))
    return 0
  }
}

function main() {
  console.log(colors.bold('🔍 BBWA Environment Validation'))
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
  
  // Check if .env.local exists
  if (!fs.existsSync('.env.local') && !fs.existsSync('.env')) {
    console.log(colors.red('❌ No environment file found'))
    console.log(colors.gray('Copy .env.example to .env.local and configure your variables\n'))
    console.log('Quick start:')
    console.log(colors.cyan('cp .env.example .env.local'))
    console.log(colors.cyan('npm run env:validate'))
    console.log('')
    process.exit(1)
  }
  
  const env = loadEnvironment()
  const results = {}
  
  // Validate each category
  Object.entries(ENV_SCHEMA).forEach(([severity, variables]) => {
    console.log(colors.bold(`\n${severity.toUpperCase()} VARIABLES`))
    console.log('─'.repeat(40))
    
    results[severity] = {}
    
    Object.entries(variables).forEach(([key, config]) => {
      const result = validateVariable(key, config, env, severity)
      results[severity][key] = result
      printValidationResult(key, config, result, severity)
    })
  })
  
  // Generate setup commands
  const setupCommands = generateSetupCommands(env)
  printSetupCommands(setupCommands)
  
  // Print summary and exit with appropriate code
  const exitCode = printSummary(results)
  
  if (exitCode === 0) {
    console.log(colors.gray('\n💡 Next steps:'))
    console.log(colors.gray('   npm run dev     # Start development server'))
    console.log(colors.gray('   npm run build   # Test production build'))
  }
  
  process.exit(exitCode)
}

// Handle script execution
if (require.main === module) {
  main()
}