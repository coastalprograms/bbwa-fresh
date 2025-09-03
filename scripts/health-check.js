#!/usr/bin/env node

/**
 * Production Health Check Script
 * Validates application health, performance, and dependencies
 */

const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  timeout: 10000,
  healthEndpoints: [
    'http://localhost:3000/api/health',
    'https://baysidebuilderswa.com.au/api/health',
  ],
  criticalPaths: [
    '/',
    '/admin',
    '/check-in',
    '/induction',
  ],
  performance: {
    maxResponseTime: 2000,
    maxMemoryUsage: 512 * 1024 * 1024, // 512MB
    maxCpuUsage: 80,
  }
};

class HealthChecker {
  constructor() {
    this.results = {
      timestamp: new Date().toISOString(),
      status: 'healthy',
      checks: {},
      performance: {},
      warnings: [],
      errors: []
    };
  }

  async runAllChecks() {
    console.log('🏥 Starting BBWA Health Check...\n');

    try {
      await this.checkEnvironment();
      await this.checkDependencies();
      await this.checkEndpoints();
      await this.checkPerformance();
      await this.checkDatabase();
      await this.generateReport();
    } catch (error) {
      this.results.status = 'unhealthy';
      this.results.errors.push(error.message);
      console.error('❌ Health check failed:', error.message);
    }

    return this.results;
  }

  async checkEnvironment() {
    console.log('🔍 Checking environment variables...');
    
    const requiredEnvVars = [
      'NEXT_PUBLIC_SUPABASE_URL',
      'NEXT_PUBLIC_SUPABASE_ANON_KEY',
      'SUPABASE_SERVICE_ROLE_KEY'
    ];

    const missing = requiredEnvVars.filter(varName => !process.env[varName]);
    
    if (missing.length > 0) {
      this.results.errors.push(`Missing environment variables: ${missing.join(', ')}`);
      this.results.status = 'unhealthy';
    } else {
      this.results.checks.environment = 'healthy';
      console.log('✅ Environment variables validated');
    }
  }

  async checkDependencies() {
    console.log('📦 Checking critical dependencies...');
    
    try {
      const packageJson = JSON.parse(
        fs.readFileSync(path.join(process.cwd(), 'apps/web/package.json'), 'utf8')
      );
      
      const criticalDeps = [
        'next',
        'react',
        '@supabase/supabase-js',
        '@supabase/ssr'
      ];
      
      const missingDeps = criticalDeps.filter(dep => !packageJson.dependencies[dep]);
      
      if (missingDeps.length > 0) {
        this.results.errors.push(`Missing critical dependencies: ${missingDeps.join(', ')}`);
      } else {
        this.results.checks.dependencies = 'healthy';
        console.log('✅ Critical dependencies verified');
      }
    } catch (error) {
      this.results.errors.push(`Failed to check dependencies: ${error.message}`);
    }
  }

  async checkEndpoints() {
    console.log('🌐 Checking application endpoints...');
    
    for (const endpoint of CONFIG.healthEndpoints) {
      try {
        const startTime = Date.now();
        const response = await this.makeRequest(endpoint);
        const responseTime = Date.now() - startTime;
        
        if (response.statusCode === 200) {
          this.results.checks[endpoint] = {
            status: 'healthy',
            responseTime: `${responseTime}ms`
          };
          console.log(`✅ ${endpoint} - ${responseTime}ms`);
          
          if (responseTime > CONFIG.performance.maxResponseTime) {
            this.results.warnings.push(`Slow response from ${endpoint}: ${responseTime}ms`);
          }
        } else {
          this.results.errors.push(`${endpoint} returned status ${response.statusCode}`);
        }
      } catch (error) {
        this.results.errors.push(`Failed to reach ${endpoint}: ${error.message}`);
      }
    }
  }

  async checkPerformance() {
    console.log('⚡ Checking performance metrics...');
    
    const usage = process.memoryUsage();
    const cpuUsage = process.cpuUsage();
    
    this.results.performance = {
      memoryUsage: {
        rss: `${Math.round(usage.rss / 1024 / 1024)}MB`,
        heapUsed: `${Math.round(usage.heapUsed / 1024 / 1024)}MB`,
        heapTotal: `${Math.round(usage.heapTotal / 1024 / 1024)}MB`
      },
      uptime: `${Math.round(process.uptime())}s`
    };
    
    if (usage.rss > CONFIG.performance.maxMemoryUsage) {
      this.results.warnings.push(`High memory usage: ${Math.round(usage.rss / 1024 / 1024)}MB`);
    }
    
    console.log(`✅ Performance metrics captured`);
  }

  async checkDatabase() {
    console.log('🗄️ Checking database connectivity...');
    
    try {
      if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
        // Simple connectivity check
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const response = await this.makeRequest(`${supabaseUrl}/rest/v1/`);
        
        if (response.statusCode === 200 || response.statusCode === 401) {
          this.results.checks.database = 'healthy';
          console.log('✅ Database connectivity verified');
        } else {
          this.results.errors.push(`Database connectivity issue: Status ${response.statusCode}`);
        }
      } else {
        this.results.warnings.push('Database URL not configured');
      }
    } catch (error) {
      this.results.errors.push(`Database check failed: ${error.message}`);
    }
  }

  makeRequest(url) {
    return new Promise((resolve, reject) => {
      const client = url.startsWith('https') ? https : http;
      const timeout = setTimeout(() => {
        reject(new Error('Request timeout'));
      }, CONFIG.timeout);
      
      const req = client.get(url, (res) => {
        clearTimeout(timeout);
        resolve(res);
      });
      
      req.on('error', (error) => {
        clearTimeout(timeout);
        reject(error);
      });
    });
  }

  generateReport() {
    console.log('\n📊 Health Check Report');
    console.log('========================');
    console.log(`Status: ${this.results.status.toUpperCase()}`);
    console.log(`Timestamp: ${this.results.timestamp}`);
    
    if (this.results.warnings.length > 0) {
      console.log('\n⚠️  Warnings:');
      this.results.warnings.forEach(warning => console.log(`   - ${warning}`));
    }
    
    if (this.results.errors.length > 0) {
      console.log('\n❌ Errors:');
      this.results.errors.forEach(error => console.log(`   - ${error}`));
    }
    
    // Write detailed report
    const reportPath = path.join(process.cwd(), 'health-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(this.results, null, 2));
    console.log(`\n📄 Detailed report saved to: ${reportPath}`);
    
    // Exit with appropriate code
    if (this.results.status === 'unhealthy') {
      process.exit(1);
    }
  }
}

// Run health check if called directly
if (require.main === module) {
  const checker = new HealthChecker();
  checker.runAllChecks().catch(console.error);
}

module.exports = HealthChecker;