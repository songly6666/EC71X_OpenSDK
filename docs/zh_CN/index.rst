利尔达CAT1.bis 产品介绍
==========================

:link_to_translation:`en:[English]`

.. only:: fast_build

    .. warning::

        快速预览中不包括 API 函数文档。如需生成完整的文档，请在 MR 中添加 docs_full 标签。



.. only:: html

    <!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>利尔达NT26系列Cat.1模组 | 专家版产品介绍</title>
    <style>
        :root {
            --primary: #165DFF;
            --primary-dark: #0E42D2;
            --secondary: #36CFC9;
            --success: #52C41A;
            --warning: #FAAD14;
            --danger: #FF4D4F;
            --gray-100: #F5F7FA;
            --gray-200: #E4E6EB;
            --gray-300: #C9CDD4;
            --gray-400: #86909C;
            --gray-500: #4E5969;
            --gray-600: #272E3B;
            --gray-700: #1D2129;
            --shadow-sm: 0 2px 8px rgba(0,0,0,0.08);
            --shadow-md: 0 4px 16px rgba(0,0,0,0.12);
            --shadow-lg: 0 8px 24px rgba(0,0,0,0.16);
            --radius-sm: 4px;
            --radius-md: 8px;
            --radius-lg: 12px;
            --radius-xl: 16px;
        }
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: "Inter", "Microsoft Yahei", "PingFang SC", sans-serif;
            background: linear-gradient(135deg, #f5f7fa 0%, #e4eaf5 100%);
            color: var(--gray-700);
            line-height: 1.6;
            font-size: 16px;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }
        
        .header {
            background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
            color: white;
            padding: 40px 0;
            margin-bottom: 40px;
            border-radius: var(--radius-xl);
            box-shadow: var(--shadow-lg);
            position: relative;
            overflow: hidden;
        }
        
        .header::before {
            content: "";
            position: absolute;
            top: 0;
            right: 0;
            width: 40%;
            height: 100%;
            background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="80" cy="20" r="30" fill="rgba(255,255,255,0.05)"/><circle cx="90" cy="80" r="40" fill="rgba(255,255,255,0.03)"/></svg>') no-repeat;
            background-size: cover;
        }
        
        .header-content {
            position: relative;
            z-index: 1;
            padding: 0 50px;
        }
        
        .header h1 {
            font-size: 36px;
            font-weight: 700;
            margin-bottom: 10px;
        }
        
        .header-subtitle {
            font-size: 18px;
            opacity: 0.9;
            margin-bottom: 20px;
        }
        
        .header-badges {
            display: flex;
            gap: 12px;
            flex-wrap: wrap;
        }
        
        .badge {
            background: rgba(255,255,255,0.15);
            backdrop-filter: blur(10px);
            padding: 6px 14px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 500;
        }
        
        .section {
            background: white;
            border-radius: var(--radius-lg);
            padding: 35px;
            margin-bottom: 30px;
            box-shadow: var(--shadow-md);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .section:hover {
            transform: translateY(-2px);
            box-shadow: var(--shadow-lg);
        }
        
        .section-title {
            font-size: 24px;
            font-weight: 600;
            color: var(--primary);
            margin-bottom: 25px;
            padding-bottom: 12px;
            border-bottom: 2px solid var(--gray-200);
            position: relative;
        }
        
        .section-title::after {
            content: "";
            position: absolute;
            bottom: -2px;
            left: 0;
            width: 60px;
            height: 2px;
            background: var(--primary);
        }
        
        .section-subtitle {
            font-size: 18px;
            font-weight: 600;
            color: var(--gray-600);
            margin: 25px 0 15px;
        }
        
        .product-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(550px, 1fr));
            gap: 25px;
            margin-top: 20px;
        }
        
        .product-card {
            background: var(--gray-100);
            border-radius: var(--radius-md);
            padding: 25px;
            border-left: 4px solid var(--primary);
            transition: all 0.3s ease;
        }
        
        .product-card:hover {
            background: white;
            box-shadow: var(--shadow-sm);
        }
        
        .product-card h3 {
            font-size: 20px;
            font-weight: 600;
            color: var(--gray-700);
            margin-bottom: 15px;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .product-tag {
            background: var(--primary);
            color: white;
            font-size: 12px;
            padding: 3px 8px;
            border-radius: 4px;
            font-weight: 500;
        }
        
        .product-tag.success {
            background: var(--success);
        }
        
        .product-tag.warning {
            background: var(--warning);
        }
        
        .product-tag.secondary {
            background: var(--secondary);
        }
        
        .product-specs {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
            margin: 15px 0;
        }
        
        .spec-item {
            display: flex;
            justify-content: space-between;
            padding: 6px 0;
            border-bottom: 1px dashed var(--gray-200);
        }
        
        .spec-label {
            color: var(--gray-500);
            font-weight: 500;
        }
        
        .spec-value {
            color: var(--gray-700);
            font-weight: 600;
        }
        
        .product-features {
            margin-top: 15px;
            padding-left: 20px;
        }
        
        .product-features li {
            margin-bottom: 8px;
            color: var(--gray-600);
        }
        
        .comparison-table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
            font-size: 14px;
        }
        
        .comparison-table th,
        .comparison-table td {
            padding: 14px 12px;
            text-align: center;
            border: 1px solid var(--gray-200);
        }
        
        .comparison-table th {
            background: var(--primary);
            color: white;
            font-weight: 600;
            position: sticky;
            top: 0;
            z-index: 10;
        }
        
        .comparison-table tr:nth-child(even) {
            background: var(--gray-100);
        }
        
        .comparison-table tr:hover {
            background: #e8f0ff;
        }
        
        .highlight {
            background: #fff7e6;
            font-weight: 600;
        }
        
        .advantages-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 20px;
            margin-top: 20px;
        }
        
        .advantage-card {
            background: linear-gradient(135deg, #f8faff 0%, #e8f0ff 100%);
            border-radius: var(--radius-md);
            padding: 20px;
            border-top: 3px solid var(--primary);
        }
        
        .advantage-card h4 {
            font-size: 18px;
            font-weight: 600;
            color: var(--primary);
            margin-bottom: 12px;
        }
        
        .advantage-card p {
            color: var(--gray-600);
            line-height: 1.7;
        }
        
        .value-proposition {
            background: linear-gradient(135deg, #e6f7ff 0%, #f0f5ff 100%);
            border-radius: var(--radius-md);
            padding: 25px;
            margin: 25px 0;
            border-left: 4px solid var(--secondary);
        }
        
        .value-proposition h3 {
            color: var(--secondary);
            margin-bottom: 15px;
            font-size: 20px;
        }
        
        .value-list {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 15px;
        }
        
        .value-item {
            display: flex;
            align-items: flex-start;
            gap: 10px;
        }
        
        .value-icon {
            color: var(--secondary);
            font-size: 20px;
            font-weight: bold;
            margin-top: 2px;
        }
        
        .industry-solutions {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-top: 20px;
        }
        
        .solution-card {
            background: white;
            border-radius: var(--radius-md);
            padding: 20px;
            box-shadow: var(--shadow-sm);
            text-align: center;
            transition: all 0.3s ease;
        }
        
        .solution-card:hover {
            transform: translateY(-5px);
            box-shadow: var(--shadow-md);
        }
        
        .solution-icon {
            width: 60px;
            height: 60px;
            background: var(--primary);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 15px;
            color: white;
            font-size: 24px;
        }
        
        .solution-card h4 {
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 10px;
            color: var(--gray-700);
        }
        
        .solution-card p {
            color: var(--gray-500);
            font-size: 14px;
        }
        
        .footer {
            text-align: center;
            padding: 30px;
            color: var(--gray-500);
            font-size: 14px;
        }
        
        .print-only {
            display: none;
        }
        
        @media print {
            body {
                background: white;
                font-size: 14px;
            }
            
            .header {
                border-radius: 0;
                box-shadow: none;
                padding: 20px 0;
            }
            
            .section {
                box-shadow: none;
                border: 1px solid var(--gray-200);
                page-break-inside: avoid;
            }
            
            .no-print {
                display: none;
            }
            
            .print-only {
                display: block;
            }
        }
        
        @media (max-width: 768px) {
            .container {
                padding: 10px;
            }
            
            .header {
                padding: 30px 0;
                margin-bottom: 20px;
                border-radius: var(--radius-lg);
            }
            
            .header-content {
                padding: 0 20px;
            }
            
            .header h1 {
                font-size: 28px;
            }
            
            .section {
                padding: 20px;
                margin-bottom: 20px;
            }
            
            .product-grid {
                grid-template-columns: 1fr;
            }
            
            .comparison-table {
                font-size: 12px;
            }
            
            .comparison-table th,
            .comparison-table td {
                padding: 8px 6px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- 头部 -->
        <div class="header">
            <div class="header-content">
                <h1>利尔达 NT26 蝉翼系列 Cat.1 模组</h1>
                <div class="header-subtitle">基于移芯EC718/718PM平台 | 极致小型化 | 工业级可靠性 | 全球覆盖</div>
                <div class="header-badges">
                    <span class="badge">4G LTE Cat.1 bis</span>
                    <span class="badge">全网通覆盖</span>
                    <span class="badge">1.7mm 极致超薄</span>
                    <span class="badge">休眠功耗低至6.5μA</span>
                    <span class="badge">CE/FCC/Anatel认证</span>
                </div>
            </div>
        </div>

        <!-- 产品概述 -->
        <div class="section">
            <h2 class="section-title">一、产品概述</h2>
            <p>利尔达NT26"蝉翼"系列是专为电池供电、小型化物联网终端设计的高性能4G LTE Cat.1模组。基于移芯通信最新一代EC718/718PM低功耗平台，在保持17.7×15.8mm超小尺寸的同时，实现了媲美NB-IoT的功耗表现和工业级的可靠性。</p>
            
            <p style="margin-top: 15px;">本系列产品已形成完整的产品矩阵，覆盖<strong>标准超薄、宽压供电、全网通、全球多频段</strong>等多个细分市场，广泛应用于智能穿戴、智能表计、定位追踪、安防传感及工业互联等领域，帮助客户快速实现产品小型化、低功耗化和全球化部署。</p>
            
            <div class="value-proposition">
                <h3>核心客户价值</h3>
                <div class="value-list">
                    <div class="value-item">
                        <span class="value-icon">✓</span>
                        <span><strong>极致尺寸</strong>：1.7mm超薄设计，突破传统Cat.1模组结构限制</span>
                    </div>
                    <div class="value-item">
                        <span class="value-icon">✓</span>
                        <span><strong>超长续航</strong>：718PM平台深度优化，电池寿命提升30%以上</span>
                    </div>
                    <div class="value-item">
                        <span class="value-icon">✓</span>
                        <span><strong>快速上市</strong>：统一封装焊盘，兼容替换，开发周期缩短50%</span>
                    </div>
                    <div class="value-item">
                        <span class="value-icon">✓</span>
                        <span><strong>全球部署</strong>：多频段版本+完整认证，一站式出海解决方案</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- 核心产品矩阵 -->
        <div class="section">
            <h2 class="section-title">二、核心产品矩阵</h2>
            
            <div class="product-grid">
                <!-- NT26 蝉翼标准版 -->
                <div class="product-card">
                    <h3>NT26 蝉翼标准版 <span class="product-tag">基础款</span></h3>
                    <div class="product-specs">
                        <div class="spec-item">
                            <span class="spec-label">核心平台</span>
                            <span class="spec-value">移芯 EC718</span>
                        </div>
                        <div class="spec-item">
                            <span class="spec-label">尺寸规格</span>
                            <span class="spec-value">17.7×15.8×1.7mm</span>
                        </div>
                        <div class="spec-item">
                            <span class="spec-label">封装类型</span>
                            <span class="spec-value">LCC邮票孔</span>
                        </div>
                        <div class="spec-item">
                            <span class="spec-label">峰值速率</span>
                            <span class="spec-value">DL:10Mbps / UL:5Mbps</span>
                        </div>
                    </div>
                    <ul class="product-features">
                        <li>极致超薄设计，结构空间受限设备首选</li>
                        <li>支持FOTA远程升级、VoLTE高清语音</li>
                        <li>内置WiFi-Scan辅助定位功能</li>
                        <li>兼容eSIM和实体SIM卡</li>
                    </ul>
                    <p style="margin-top: 15px; font-weight: 500; color: var(--primary);">
                        推荐场景：智能手表、医疗手环、定位工牌、迷你追踪器
                    </p>
                </div>

                <!-- NT26F 宽压低功耗版 -->
                <div class="product-card">
                    <h3>NT26F 宽压低功耗版 <span class="product-tag success">工业级</span></h3>
                    <div class="product-specs">
                        <div class="spec-item">
                            <span class="spec-label">核心平台</span>
                            <span class="spec-value">移芯 EC718</span>
                        </div>
                        <div class="spec-item">
                            <span class="spec-label">供电范围</span>
                            <span class="spec-value">2.3V~4.5V 超宽电压</span>
                        </div>
                        <div class="spec-item">
                            <span class="spec-label">工作温度</span>
                            <span class="spec-value">-40℃~+85℃</span>
                        </div>
                        <div class="spec-item">
                            <span class="spec-label">封装类型</span>
                            <span class="spec-value">LCC邮票孔</span>
                        </div>
                    </div>
                    <ul class="product-features">
                        <li>支持电池低压跌落和太阳能混合供电</li>
                        <li>工业级宽温设计，适应极端环境</li>
                        <li>抗电源波动能力强，运行稳定可靠</li>
                        <li>采用工业镭雕工艺，适合大规模量产</li>
                    </ul>
                    <p style="margin-top: 15px; font-weight: 500; color: var(--success);">
                        推荐场景：无线表计、烟感报警器、燃气探测、户外传感终端
                    </p>
                </div>

                <!-- NT26F6D0 全网通超薄版 -->
                <div class="product-card">
                    <h3>NT26F6D0 全网通超薄版 <span class="product-tag warning">旗舰款</span></h3>
                    <div class="product-specs">
                        <div class="spec-item">
                            <span class="spec-label">核心平台</span>
                            <span class="spec-value">移芯 718PM</span>
                        </div>
                        <div class="spec-item">
                            <span class="spec-label">尺寸规格</span>
                            <span class="spec-value">17.7×15.8×1.7mm</span>
                        </div>
                        <div class="spec-item">
                            <span class="spec-label">网络覆盖</span>
                            <span class="spec-value">国内三大运营商全网通</span>
                        </div>
                        <div class="spec-item">
                            <span class="spec-label">封装兼容</span>
                            <span class="spec-value">与NT26系列完全兼容</span>
                        </div>
                    </div>
                    <ul class="product-features">
                        <li>718PM平台功耗进一步优化，续航更长</li>
                        <li>全频段覆盖，网络兼容性最佳</li>
                        <li>无需改板即可从NT26升级替换</li>
                        <li>支持VoLTE、FOTA、WiFi-Scan全功能</li>
                    </ul>
                    <p style="margin-top: 15px; font-weight: 500; color: var(--warning);">
                        推荐场景：超薄智能穿戴、高端定位器、电池供电安防设备
                    </p>
                </div>

                <!-- NT26K2 Cat.1 bis 标准版 -->
                <div class="product-card">
                    <h3>NT26K2 Cat.1 bis 版 <span class="product-tag secondary">智能款</span></h3>
                    <div class="product-specs">
                        <div class="spec-item">
                            <span class="spec-label">核心平台</span>
                            <span class="spec-value">移芯 EC718</span>
                        </div>
                        <div class="spec-item">
                            <span class="spec-label">休眠功耗</span>
                            <span class="spec-value">低至6.5μA</span>
                        </div>
                        <div class="spec-item">
                            <span class="spec-label">封装类型</span>
                            <span class="spec-value">LCC+LGA加固</span>
                        </div>
                        <div class="spec-item">
                            <span class="spec-label">增值功能</span>
                            <span class="spec-value">TTS/扫码/双SIM</span>
                        </div>
                    </div>
                    <ul class="product-features">
                        <li>支持3GPP R13/R14 Cat.1 bis标准</li>
                        <li>极致低功耗设计，电池寿命最大化</li>
                        <li>内置TTS语音播报和扫码算法</li>
                        <li>支持双SIM卡切换，网络可靠性更高</li>
                    </ul>
                    <p style="margin-top: 15px; font-weight: 500; color: var(--secondary);">
                        推荐场景：云喇叭、迷你POS、IPC摄像头、共享设备
                    </p>
                </div>
            </div>

            <!-- 全球版单独介绍 -->
            <div class="product-card" style="margin-top: 25px;">
                <h3>NT26 全球多频段版本 <span class="product-tag">出海专用</span></h3>
                <div class="product-specs">
                    <div class="spec-item">
                        <span class="spec-label">核心平台</span>
                        <span class="spec-value">移芯 EC718</span>
                    </div>
                    <div class="spec-item">
                        <span class="spec-label">尺寸规格</span>
                        <span class="spec-value">17.7×15.8×2.0mm</span>
                    </div>
                    <div class="spec-item">
                        <span class="spec-label">版本划分</span>
                        <span class="spec-value">FGL(全球)/FNA(北美)/FLA(拉美)</span>
                    </div>
                    <div class="spec-item">
                        <span class="spec-label">国际认证</span>
                        <span class="spec-value">CE/FCC/Anatel/RoHS</span>
                    </div>
                </div>
                <ul class="product-features" style="margin-top: 15px;">
                    <li>覆盖全球主流LTE Cat.1频段，无需额外硬件调整</li>
                    <li>自带完整国际认证，大幅缩短产品上市周期</li>
                    <li>支持eSIM和远程SIM配置，便于全球部署</li>
                    <li>统一软件接口，国内/海外版本无缝切换</li>
                </ul>
                <p style="margin-top: 15px; font-weight: 500; color: var(--primary);">
                    推荐场景：出海资产追踪、跨境共享设备、海外民用物联网终端
                </p>
            </div>
        </div>

        <!-- 详细参数对比 -->
        <div class="section">
            <h2 class="section-title">三、详细技术参数对比</h2>
            
            <table class="comparison-table">
                <thead>
                    <tr>
                        <th>参数项目</th>
                        <th>NT26 标准版</th>
                        <th>NT26F 宽压版</th>
                        <th>NT26F6D0 旗舰版</th>
                        <th>NT26K2 智能版</th>
                        <th>NT26-FGL 全球版</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>核心平台</td>
                        <td>移芯 EC718</td>
                        <td>移芯 EC718</td>
                        <td class="highlight">移芯 718PM</td>
                        <td>移芯 EC718</td>
                        <td>移芯 EC718</td>
                    </tr>
                    <tr>
                        <td>尺寸(mm)</td>
                        <td class="highlight">17.7×15.8×1.7</td>
                        <td>17.7×15.8×2.0</td>
                        <td class="highlight">17.7×15.8×1.7</td>
                        <td>17.7×15.8×2.4</td>
                        <td>17.7×15.8×2.0</td>
                    </tr>
                    <tr>
                        <td>封装形式</td>
                        <td>LCC邮票孔</td>
                        <td>LCC邮票孔</td>
                        <td>LCC邮票孔</td>
                        <td>LCC+LGA</td>
                        <td>LCC邮票孔</td>
                    </tr>
                    <tr>
                        <td>供电范围</td>
                        <td>3.0V~3.6V</td>
                        <td class="highlight">2.3V~4.5V</td>
                        <td>3.0V~3.6V</td>
                        <td>3.0V~3.6V</td>
                        <td>3.0V~3.6V</td>
                    </tr>
                    <tr>
                        <td>工作温度</td>
                        <td>-35℃~+75℃</td>
                        <td class="highlight">-40℃~+85℃</td>
                        <td>-35℃~+75℃</td>
                        <td>-35℃~+75℃</td>
                        <td>-35℃~+75℃</td>
                    </tr>
                    <tr>
                        <td>休眠功耗</td>
                        <td>≤10μA</td>
                        <td>≤10μA</td>
                        <td class="highlight">≤8μA</td>
                        <td class="highlight">≤6.5μA</td>
                        <td>≤10μA</td>
                    </tr>
                    <tr>
                        <td>网络覆盖</td>
                        <td>国内全网通</td>
                        <td>国内全网通</td>
                        <td class="highlight">国内全网通</td>
                        <td>国内全网通</td>
                        <td>全球多频段</td>
                    </tr>
                    <tr>
                        <td>VoLTE支持</td>
                        <td>✓</td>
                        <td>✓</td>
                        <td>✓</td>
                        <td>✓</td>
                        <td>✓</td>
                    </tr>
                    <tr>
                        <td>FOTA升级</td>
                        <td>✓</td>
                        <td>✓</td>
                        <td>✓</td>
                        <td>✓</td>
                        <td>✓</td>
                    </tr>
                    <tr>
                        <td>WiFi-Scan定位</td>
                        <td>✓</td>
                        <td>✓</td>
                        <td>✓</td>
                        <td>✓</td>
                        <td>✓</td>
                    </tr>
                    <tr>
                        <td>内置TTS</td>
                        <td>✗</td>
                        <td>✗</td>
                        <td>✗</td>
                        <td class="highlight">✓</td>
                        <td>✗</td>
                    </tr>
                    <tr>
                        <td>内置扫码算法</td>
                        <td>✗</td>
                        <td>✗</td>
                        <td>✗</td>
                        <td class="highlight">✓</td>
                        <td>✗</td>
                    </tr>
                    <tr>
                        <td>双SIM卡支持</td>
                        <td>✗</td>
                        <td>✗</td>
                        <td>✗</td>
                        <td class="highlight">✓</td>
                        <td>✗</td>
                    </tr>
                    <tr>
                        <td>国际认证</td>
                        <td>CCC/SRRC</td>
                        <td>CCC/SRRC</td>
                        <td>CCC/SRRC</td>
                        <td>CCC/SRRC</td>
                        <td class="highlight">CE/FCC/Anatel</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- 核心技术优势 -->
        <div class="section">
            <h2 class="section-title">四、核心技术优势深度解析</h2>
            
            <div class="advantages-grid">
                <div class="advantage-card">
                    <h4>1. 极致小型化设计</h4>
                    <p>采用先进的系统级封装(SiP)技术，在17.7×15.8mm的超小尺寸内集成了完整的4G通信系统。1.7mm的极致厚度比传统Cat.1模组薄30%以上，为穿戴设备和小型终端提供了宝贵的结构空间。</p>
                </div>
                
                <div class="advantage-card">
                    <h4>2. 行业领先的低功耗</h4>
                    <p>基于移芯EC718/718PM平台的深度功耗优化，NT26系列休眠功耗低至6.5μA，工作功耗比同类产品降低25%，电池供电设备的续航时间可提升30%以上，真正实现"一次安装，多年使用"。</p>
                </div>
                
                <div class="advantage-card">
                    <h4>3. 工业级可靠性</h4>
                    <p>NT26F型号支持-40℃~+85℃的工业级宽温范围和2.3V~4.5V的超宽电压输入，能够在极端温度和不稳定供电环境下稳定运行，特别适合户外表计和工业传感应用。</p>
                </div>
                
                <div class="advantage-card">
                    <h4>4. 统一封装与软件</h4>
                    <p>全系列产品采用统一的LCC邮票孔封装和软件API接口，客户可以在不同型号之间无缝切换，无需修改PCB设计和应用代码，大幅降低开发成本和产品迭代周期。</p>
                </div>
                
                <div class="advantage-card">
                    <h4>5. 丰富的增值功能</h4>
                    <p>NT26K2内置TTS语音播报和扫码算法，无需额外MCU即可实现智能交互功能。支持OpenCPU开发模式，客户可以直接在模组上运行应用程序，进一步降低BOM成本。</p>
                </div>
                
                <div class="advantage-card">
                    <h4>6. 全球化部署能力</h4>
                    <p>提供覆盖全球、北美、拉美等主要市场的多频段版本，自带CE、FCC、Anatel等国际认证，帮助客户快速进入海外市场，实现"一个设计，全球销售"。</p>
                </div>
            </div>
        </div>

        <!-- 行业解决方案 -->
        <div class="section">
            <h2 class="section-title">五、行业解决方案</h2>
            
            <div class="industry-solutions">
                <div class="solution-card">
                    <div class="solution-icon">⌚</div>
                    <h4>智能穿戴</h4>
                    <p>1.7mm超薄设计+超低功耗，完美适配智能手表、医疗手环、定位工牌等穿戴设备，提供更长的续航时间和更舒适的佩戴体验。</p>
                </div>
                
                <div class="solution-card">
                    <div class="solution-icon">📊</div>
                    <h4>智能表计</h4>
                    <p>2.3V~4.5V宽压输入+工业级宽温，支持电池和太阳能供电，适用于水表、气表、电表等无源表计，实现10年以上免维护运行。</p>
                </div>
                
                <div class="solution-card">
                    <div class="solution-icon">📍</div>
                    <h4>定位追踪</h4>
                    <p>内置WiFi-Scan辅助定位+全球多频段支持，适用于人员定位、宠物追踪、物流资产监控等场景，提供精准可靠的位置服务。</p>
                </div>
                
                <div class="solution-card">
                    <div class="solution-icon">🔔</div>
                    <h4>安防传感</h4>
                    <p>超低功耗+高可靠性，适用于烟感报警器、燃气探测器、入侵检测等安防设备，确保在紧急情况下能够及时报警。</p>
                </div>
                
                <div class="solution-card">
                    <div class="solution-icon">💳</div>
                    <h4>金融支付</h4>
                    <p>内置TTS和扫码算法+双SIM卡支持，适用于云喇叭、迷你POS、扫码设备等金融终端，提供稳定可靠的支付通信。</p>
                </div>
                
                <div class="solution-card">
                    <div class="solution-icon">🌐</div>
                    <h4>共享经济</h4>
                    <p>全球多频段版本+完整国际认证，适用于共享单车、共享充电宝、共享雨伞等共享设备，支持全球范围的部署和运营。</p>
                </div>
            </div>
        </div>

        <!-- 服务与支持 -->
        <div class="section">
            <h2 class="section-title">六、技术服务与支持</h2>
            
            <ul style="margin-top: 15px; line-height: 1.8;">
                <li><strong>完整的开发套件</strong>：提供EVB评估板、参考设计、原理图和PCB布局指南</li>
                <li><strong>丰富的软件资源</strong>：提供AT指令集、SDK开发包、示例代码和技术文档</li>
                <li><strong>专业的技术支持</strong>：资深FAE团队提供一对一技术支持，快速解决开发问题</li>
                <li><strong>定制化服务</strong>：提供固件定制、功能裁剪、硬件修改等定制化服务</li>
                <li><strong>全球供应链保障</strong>：稳定的供应链体系，确保产品的持续供应和快速交付</li>
            </ul>
            
            <div class="tip" style="margin-top: 25px; background: #f6ffed; border-left: 4px solid #52c41a; padding: 15px; border-radius: 4px;">
                <strong>技术支持热线：</strong>400-888-8888 | <strong>技术支持邮箱：</strong>tech@lierda.com<br>
                <strong>官方网站：</strong>www.lierda.com | <strong>样品申请：</strong>可通过官网或当地销售代表申请免费样品
            </div>
        </div>

        <!-- 页脚 -->
        <div class="footer">
            <p>© 2026 利尔达科技集团股份有限公司 版权所有</p>
            <p class="no-print" style="margin-top: 10px;">本页面支持浏览器直接打开、投屏演示和打印输出 | 专家版产品介绍</p>
        </div>
    </div>
</body>
</html>

.. only:: latex

    本文档描述了您的项目的使用方法。


==================  ==================  ==================
`SDK 介绍`_          `API 指南`_          `快速入门`_
==================  ==================  ==================

.. _快速入门: general/quick-start.html

.. _API 指南: software/api-overview.html

.. _SDK 介绍: general/index.html


.. toctree::
   :hidden:
   :maxdepth: 4
   :includehidden:
   :titlesonly:

   general/index
   hardware/index
   software/index
   components/index
   tools/index
   examples/index
   about
