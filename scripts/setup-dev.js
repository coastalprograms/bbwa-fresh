#!/usr/bin/env node

/**
 * BBWA Development Environment Setup Script
 * 
 * Interactive setup wizard for new developers.
 * Guides through environment configuration with smart defaults.
 * 
 * Run with: npm run env:setup
 */

const fs = require('fs')
const path = require('path')
const crypto = require('crypto')
const readline = require('readline')

// Color utilities
const colors = {
  red: (text) => `\x1b[31m${text}\x1b[0m`,
  green: (text) => `\x1b[32m${text}\x1b[0m`,
  yellow: (text) => `\x1b[33m${text}\x1b[0m`,
  blue: (text) => `\x1b[34m${text}\x1b[0m`,
  cyan: (text) => `\x1b[36m${text}\x1b[0m`,
  gray: (text) => `\x1b[90m${text}\x1b[0m`,
  bold: (text) => `\x1b[1m${text}\x1b[0m`,
}

// Readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

function prompt(question) {
  return new Promise((resolve) => {
    rl.question(question, resolve)
  })
}

async function confirmAction(message, defaultValue = true) {
  const defaultText = defaultValue ? 'Y/n' : 'y/N'
  const response = await prompt(`${message} [${defaultText}]: `)
  
  if (!response.trim()) {
    return defaultValue
  }
  
  return response.toLowerCase().startsWith('y')
}

function generateSecureSecret() {
  return crypto.randomBytes(32).toString('hex')
}

async function checkExistingEnv() {
  if (fs.existsSync('.env.local')) {
    console.log(colors.yellow('⚠️  .env.local already exists'))
    const backup = await confirmAction('Create backup before overwriting?')
    
    if (backup) {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
      const backupFile = `.env.local.backup.${timestamp}`
      fs.copyFileSync('.env.local', backupFile)
      console.log(colors.green(`✅ Backup created: ${backupFile}`))
    }
    
    const proceed = await confirmAction('Continue with setup?')
    if (!proceed) {
      console.log(colors.gray('Setup cancelled.'))
      process.exit(0)
    }
  }
}

async function gatherSupabaseConfig() {
  console.log(colors.bold('\n🗄️  SUPABASE CONFIGURATION'))
  console.log(colors.gray('Get these values from your Supabase dashboard > Settings > API\n'))
  
  const url = await prompt('Supabase Project URL (https://xxx.supabase.co): ')
  if (!url || !url.includes('.supabase.co')) {
    console.log(colors.red('❌ Invalid Supabase URL format'))
    process.exit(1)
  }
  
  const anonKey = await prompt('Anonymous/Public Key (eyJ...): ')
  if (!anonKey || !anonKey.startsWith('eyJ')) {
    console.log(colors.red('❌ Invalid anon key format'))
    process.exit(1)
  }
  
  const serviceKey = await prompt('Service Role Key (eyJ...): ')
  if (!serviceKey || !serviceKey.startsWith('eyJ')) {
    console.log(colors.red('❌ Invalid service role key format'))
    process.exit(1)
  }
  
  return { url, anonKey, serviceKey }
}

async function gatherAIConfig() {
  console.log(colors.bold('\n🤖 AI CONFIGURATION'))
  console.log(colors.gray('For generating project descriptions in the admin dashboard\n'))
  
  const enableAI = await confirmAction('Enable AI project generation?')
  if (!enableAI) {
    return { provider: '', apiKey: '' }
  }
  
  console.log('\nChoose AI provider:')
  console.log('1. Gemini (Google AI Studio) - Recommended')
  console.log('2. OpenAI (ChatGPT API)')
  console.log('3. Skip AI setup')
  
  const choice = await prompt('Select option [1-3]: ')
  
  switch (choice) {
    case '1':
      console.log(colors.gray('\nGet your Gemini API key from: https://makersuite.google.com/app/apikey'))
      const geminiKey = await prompt('Gemini API Key (AIza...): ')
      return { provider: 'gemini', apiKey: geminiKey }
    
    case '2':
      console.log(colors.gray('\nGet your OpenAI API key from: https://platform.openai.com/api-keys'))
      const openaiKey = await prompt('OpenAI API Key (sk-...): ')
      return { provider: 'openai', apiKey: openaiKey }
    
    default:
      return { provider: '', apiKey: '' }
  }
}

async function gatherMapsConfig() {
  console.log(colors.bold('\n🗺️  GOOGLE MAPS CONFIGURATION'))
  console.log(colors.gray('For service area maps on the public website\n'))
  
  const enableMaps = await confirmAction('Enable Google Maps integration?')
  if (!enableMaps) {
    return ''
  }
  
  console.log(colors.gray('Get your API key from: https://console.developers.google.com/'))
  console.log(colors.gray('Enable: Maps JavaScript API, Geocoding API\n'))
  
  const mapsKey = await prompt('Google Maps API Key (AIza...): ')
  return mapsKey
}

async function gatherWebhookConfig() {
  console.log(colors.bold('\n🔔 COMPLIANCE ALERTS CONFIGURATION'))
  console.log(colors.gray('For automated notifications when workers fail compliance checks\n'))
  
  const enableWebhooks = await confirmAction('Set up compliance alert webhooks?')
  if (!enableWebhooks) {
    return { url: '', secret: '' }
  }
  
  console.log('\nWebhook platforms:')
  console.log('1. Make.com (recommended)')
  console.log('2. n8n')
  console.log('3. Custom webhook URL')
  console.log('4. Skip webhook setup')
  
  const choice = await prompt('Select option [1-4]: ')
  
  let webhookUrl = ''
  
  switch (choice) {
    case '1':
      webhookUrl = await prompt('Make.com Webhook URL (https://hook.make.com/...): ')
      break
    case '2':
      webhookUrl = await prompt('n8n Webhook URL (https://...): ')
      break
    case '3':
      webhookUrl = await prompt('Custom Webhook URL: ')
      break
    default:
      return { url: '', secret: '' }
  }
  
  const webhookSecret = generateSecureSecret()
  console.log(colors.green(`✅ Generated webhook secret: ${webhookSecret}`))
  
  return { url: webhookUrl, secret: webhookSecret }
}

function generateEnvContent(config) {
  const {
    supabase,
    ai,
    maps,
    webhook,
    sessionSecret
  } = config
  
  return `# ============================================================================
# BBWA - Bayside Builders WA Environment Configuration
# ============================================================================
# Generated by setup script on ${new Date().toISOString()}
# ============================================================================

# ============================================================================
# 1. SUPABASE DATABASE & AUTHENTICATION
# ============================================================================
NEXT_PUBLIC_SUPABASE_URL=${supabase.url}
NEXT_PUBLIC_SUPABASE_ANON_KEY=${supabase.anonKey}
SUPABASE_SERVICE_ROLE_KEY=${supabase.serviceKey}

# Session security for induction flow
SESSION_SECRET=${sessionSecret}

# ============================================================================
# 2. AI CONTENT GENERATION
# ============================================================================
${ai.provider ? `AI_PROVIDER=${ai.provider}` : '# AI_PROVIDER=gemini'}
${ai.provider === 'gemini' && ai.apiKey ? `GEMINI_API_KEY=${ai.apiKey}` : '# GEMINI_API_KEY='}
${ai.provider === 'openai' && ai.apiKey ? `OPENAI_API_KEY=${ai.apiKey}` : '# OPENAI_API_KEY='}

# ============================================================================
# 3. GOOGLE MAPS INTEGRATION
# ============================================================================
${maps ? `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=${maps}` : '# NEXT_PUBLIC_GOOGLE_MAPS_API_KEY='}

# ============================================================================
# 4. AIRTABLE CMS INTEGRATION
# ============================================================================
FAQ_SOURCE=local
FAQ_LIMIT=10

# Airtable Configuration (set as Supabase Function secrets)
# AIRTABLE_API_KEY=
# AIRTABLE_BASE_ID=

# ============================================================================
# 5. COMPLIANCE AUTOMATION & WEBHOOKS
# ============================================================================
${webhook.url ? `AUTOMATION_WEBHOOK_URL=${webhook.url}` : '# AUTOMATION_WEBHOOK_URL='}
${webhook.secret ? `AUTOMATION_WEBHOOK_SECRET=${webhook.secret}` : '# AUTOMATION_WEBHOOK_SECRET='}

# ============================================================================
# 6. DEVELOPMENT CONFIGURATION
# ============================================================================
NODE_ENV=development
ENABLE_ANALYTICS=false
ENABLE_DEBUG_MODE=false

# ============================================================================
# SETUP COMPLETE
# ============================================================================
# Your environment is configured and ready for development!
# 
# Next steps:
# 1. npm run dev          # Start development server
# 2. npm run env:validate # Validate configuration
# 3. npm run build        # Test production build
# ============================================================================
`
}

async function main() {
  console.log(colors.bold('🚀 BBWA Development Environment Setup'))
  console.log(colors.gray('Interactive wizard to configure your development environment\n'))
  
  try {
    // Check for existing environment file
    await checkExistingEnv()
    
    // Gather configuration
    const supabase = await gatherSupabaseConfig()
    const ai = await gatherAIConfig()
    const maps = await gatherMapsConfig()
    const webhook = await gatherWebhookConfig()
    
    // Generate session secret
    const sessionSecret = generateSecureSecret()
    
    const config = {
      supabase,
      ai,
      maps,
      webhook,
      sessionSecret
    }
    
    // Generate .env.local content
    console.log(colors.bold('\n📝 GENERATING CONFIGURATION...'))
    const envContent = generateEnvContent(config)
    
    // Write .env.local file
    fs.writeFileSync('.env.local', envContent)
    console.log(colors.green('✅ .env.local created successfully!'))
    
    // Show summary
    console.log(colors.bold('\n📊 CONFIGURATION SUMMARY'))
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log(`✅ Supabase: ${colors.green('Configured')}`)
    console.log(`${ai.provider ? '✅' : '⚠️ '} AI Generation: ${ai.provider ? colors.green(ai.provider) : colors.gray('Disabled')}`)
    console.log(`${maps ? '✅' : '⚠️ '} Google Maps: ${maps ? colors.green('Configured') : colors.gray('Disabled')}`)
    console.log(`${webhook.url ? '✅' : '⚠️ '} Compliance Alerts: ${webhook.url ? colors.green('Configured') : colors.gray('Disabled')}`)
    console.log(`✅ Security: ${colors.green('Generated secrets')}`)
    
    // Next steps
    console.log(colors.bold('\n🎉 SETUP COMPLETE!'))
    console.log('Your development environment is ready.\n')
    
    console.log(colors.cyan('Next steps:'))
    console.log('1. npm run dev          # Start development server')
    console.log('2. npm run env:validate # Validate your configuration')
    console.log('3. npm run build        # Test production build')
    
    // Test if user wants to start dev server
    const startDev = await confirmAction('\nStart development server now?', false)
    if (startDev) {
      console.log(colors.cyan('\nStarting development server...'))
      rl.close()
      
      // Import and run dev server
      const { spawn } = require('child_process')
      const devProcess = spawn('npm', ['run', 'dev'], {
        stdio: 'inherit',
        cwd: process.cwd()
      })
      
      devProcess.on('error', (error) => {
        console.error(colors.red('Failed to start dev server:'), error.message)
      })
    } else {
      rl.close()
    }
    
  } catch (error) {
    console.error(colors.red('\n❌ Setup failed:'), error.message)
    rl.close()
    process.exit(1)
  }
}

// Handle script execution
if (require.main === module) {
  main()
}