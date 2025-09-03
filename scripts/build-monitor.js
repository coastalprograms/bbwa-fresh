#!/usr/bin/env node

/**
 * Build Performance Monitor
 * Tracks build times, bundle sizes, and optimization metrics
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class BuildMonitor {
  constructor() {
    this.metrics = {
      timestamp: new Date().toISOString(),
      buildStart: null,
      buildEnd: null,
      duration: null,
      bundleSize: {},
      cacheHits: 0,
      cacheMisses: 0,
      warnings: [],
      errors: []
    };
    
    this.thresholds = {
      maxBuildTime: 180000, // 3 minutes
      maxBundleSize: 1024 * 1024, // 1MB main bundle
      minCacheHitRate: 0.8 // 80%
    };
  }

  startMonitoring() {
    console.log('📊 Starting build performance monitoring...\n');
    this.metrics.buildStart = Date.now();
    
    // Hook into build process
    process.on('exit', () => this.finalizeBuild());
    process.on('SIGINT', () => this.finalizeBuild());
    process.on('SIGTERM', () => this.finalizeBuild());
  }

  async analyzeBuild() {
    try {
      await this.analyzeBundleSize();
      await this.analyzeCachePerformance();
      await this.analyzeOptimizations();
      await this.generateReport();
    } catch (error) {
      console.error('❌ Build analysis failed:', error.message);
      this.metrics.errors.push(error.message);
    }
  }

  async analyzeBundleSize() {
    console.log('📦 Analyzing bundle sizes...');
    
    const buildPath = path.join(process.cwd(), 'apps/web/.next');
    
    if (!fs.existsSync(buildPath)) {
      this.metrics.warnings.push('Build directory not found');
      return;
    }

    try {
      // Analyze static assets
      const staticPath = path.join(buildPath, 'static');
      if (fs.existsSync(staticPath)) {
        this.metrics.bundleSize = await this.calculateDirectorySize(staticPath);
      }

      // Check for large bundles
      Object.entries(this.metrics.bundleSize).forEach(([file, size]) => {
        if (size > this.thresholds.maxBundleSize) {
          this.metrics.warnings.push(`Large bundle detected: ${file} (${this.formatSize(size)})`);
        }
      });

      console.log('✅ Bundle analysis completed');
    } catch (error) {
      this.metrics.errors.push(`Bundle analysis failed: ${error.message}`);
    }
  }

  async analyzeCachePerformance() {
    console.log('🔄 Analyzing cache performance...');
    
    try {
      const turboLogPath = path.join(process.cwd(), '.turbo');
      
      if (fs.existsSync(turboLogPath)) {
        // Simple cache analysis based on turbo directory
        const cacheEntries = fs.readdirSync(turboLogPath);
        this.metrics.cacheHits = cacheEntries.length;
        
        const cacheHitRate = this.metrics.cacheHits / (this.metrics.cacheHits + this.metrics.cacheMisses);
        
        if (cacheHitRate < this.thresholds.minCacheHitRate) {
          this.metrics.warnings.push(`Low cache hit rate: ${Math.round(cacheHitRate * 100)}%`);
        }
      }

      console.log('✅ Cache analysis completed');
    } catch (error) {
      this.metrics.errors.push(`Cache analysis failed: ${error.message}`);
    }
  }

  async analyzeOptimizations() {
    console.log('⚡ Analyzing optimizations...');
    
    try {
      const nextConfigPath = path.join(process.cwd(), 'apps/web/next.config.mjs');
      
      if (fs.existsSync(nextConfigPath)) {
        const config = fs.readFileSync(nextConfigPath, 'utf8');
        
        // Check for optimization features
        const optimizations = {
          compress: config.includes('compress: true'),
          removeConsole: config.includes('removeConsole'),
          optimizeCss: config.includes('optimizeCss: true'),
          bundleAnalyzer: config.includes('withBundleAnalyzer')
        };
        
        this.metrics.optimizations = optimizations;
        
        // Recommendations
        if (!optimizations.compress) {
          this.metrics.warnings.push('Compression not enabled');
        }
        if (!optimizations.optimizeCss) {
          this.metrics.warnings.push('CSS optimization not enabled');
        }
      }

      console.log('✅ Optimization analysis completed');
    } catch (error) {
      this.metrics.errors.push(`Optimization analysis failed: ${error.message}`);
    }
  }

  async calculateDirectorySize(dirPath) {
    const sizes = {};
    
    function calculateSize(dir) {
      let totalSize = 0;
      const items = fs.readdirSync(dir);
      
      items.forEach(item => {
        const itemPath = path.join(dir, item);
        const stat = fs.statSync(itemPath);
        
        if (stat.isDirectory()) {
          totalSize += calculateSize(itemPath);
        } else {
          totalSize += stat.size;
          sizes[path.relative(dirPath, itemPath)] = stat.size;
        }
      });
      
      return totalSize;
    }
    
    calculateSize(dirPath);
    return sizes;
  }

  formatSize(bytes) {
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;
    
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    
    return `${size.toFixed(2)} ${units[unitIndex]}`;
  }

  finalizeBuild() {
    if (this.metrics.buildStart) {
      this.metrics.buildEnd = Date.now();
      this.metrics.duration = this.metrics.buildEnd - this.metrics.buildStart;
      
      // Check build time threshold
      if (this.metrics.duration > this.thresholds.maxBuildTime) {
        this.metrics.warnings.push(`Build time exceeded threshold: ${Math.round(this.metrics.duration / 1000)}s`);
      }
    }
  }

  async generateReport() {
    console.log('\n📊 Build Performance Report');
    console.log('============================');
    
    if (this.metrics.duration) {
      console.log(`⏱️  Build Duration: ${Math.round(this.metrics.duration / 1000)}s`);
    }
    
    console.log(`📦 Bundle Analysis: ${Object.keys(this.metrics.bundleSize).length} files`);
    
    if (this.metrics.cacheHits > 0) {
      const hitRate = this.metrics.cacheHits / (this.metrics.cacheHits + this.metrics.cacheMisses) * 100;
      console.log(`🔄 Cache Hit Rate: ${Math.round(hitRate)}%`);
    }
    
    if (this.metrics.warnings.length > 0) {
      console.log('\n⚠️  Performance Warnings:');
      this.metrics.warnings.forEach(warning => console.log(`   - ${warning}`));
    }
    
    if (this.metrics.errors.length > 0) {
      console.log('\n❌ Build Errors:');
      this.metrics.errors.forEach(error => console.log(`   - ${error}`));
    }
    
    // Performance recommendations
    console.log('\n💡 Performance Recommendations:');
    if (this.metrics.duration > 120000) { // 2 minutes
      console.log('   - Consider enabling incremental builds with Turbo');
      console.log('   - Review bundle splitting strategies');
    }
    
    if (Object.values(this.metrics.bundleSize).some(size => size > 500 * 1024)) {
      console.log('   - Optimize large assets and implement code splitting');
      console.log('   - Consider lazy loading for non-critical components');
    }
    
    // Save detailed metrics
    const metricsPath = path.join(process.cwd(), 'build-metrics.json');
    
    // Load historical data
    let historicalData = [];
    if (fs.existsSync(metricsPath)) {
      try {
        historicalData = JSON.parse(fs.readFileSync(metricsPath, 'utf8'));
      } catch (error) {
        console.warn('Failed to load historical build data');
      }
    }
    
    // Add current metrics
    historicalData.push(this.metrics);
    
    // Keep last 50 builds
    if (historicalData.length > 50) {
      historicalData = historicalData.slice(-50);
    }
    
    fs.writeFileSync(metricsPath, JSON.stringify(historicalData, null, 2));
    console.log(`\n📄 Build metrics saved to: ${metricsPath}`);
    
    // Generate trend analysis
    if (historicalData.length >= 2) {
      this.generateTrendAnalysis(historicalData);
    }
  }

  generateTrendAnalysis(data) {
    console.log('\n📈 Build Performance Trends:');
    
    const recent = data.slice(-5);
    const avgBuildTime = recent.reduce((sum, build) => sum + (build.duration || 0), 0) / recent.length;
    
    if (avgBuildTime > 0) {
      console.log(`   - Average build time (last 5): ${Math.round(avgBuildTime / 1000)}s`);
      
      const trend = recent.length > 1 ? 
        ((recent[recent.length - 1].duration || 0) - (recent[0].duration || 0)) / recent.length : 0;
      
      if (trend > 1000) {
        console.log('   - ⬆️ Build times are increasing - optimization needed');
      } else if (trend < -1000) {
        console.log('   - ⬇️ Build times are improving');
      } else {
        console.log('   - ➡️ Build times are stable');
      }
    }
  }
}

// CLI interface
if (require.main === module) {
  const monitor = new BuildMonitor();
  
  const command = process.argv[2];
  
  switch (command) {
    case 'start':
      monitor.startMonitoring();
      break;
    case 'analyze':
      monitor.analyzeBuild();
      break;
    default:
      console.log('Usage: node build-monitor.js [start|analyze]');
      console.log('  start   - Start monitoring build performance');
      console.log('  analyze - Analyze completed build');
      break;
  }
}

module.exports = BuildMonitor;