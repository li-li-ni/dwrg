// 动态更新求生者输入表单
function updateForm() {
    const teamType = document.getElementById('team-type').value;
    const survivorInputs = document.getElementById('survivor-inputs');
    
    // 清空现有输入框
    survivorInputs.innerHTML = '';
    
    // 根据组排类型生成输入框
    switch(teamType) {
        case '4-solo':
            for(let i = 1; i <= 4; i++) {
                survivorInputs.innerHTML += `
                    <div class="survivor-group">
                        <h3>单排 ${i}</h3>
                        <div class="form-group">
                            <label>胜率：</label>
                            <input type="number" class="survivor-winrate" min="0" max="100" step="0.1" placeholder="例如：52.5">
                            <span class="unit">%</span>
                        </div>
                    </div>
                `;
            }
            break;
        case '1-duo-2-solo':
            survivorInputs.innerHTML += `
                <div class="survivor-group">
                    <h3>双排</h3>
                    <div class="form-group">
                        <label>胜率：</label>
                        <input type="number" class="survivor-winrate" min="0" max="100" step="0.1" placeholder="例如：52.5">
                        <span class="unit">%</span>
                    </div>
                </div>
            `;
            for(let i = 1; i <= 2; i++) {
                survivorInputs.innerHTML += `
                    <div class="survivor-group">
                        <h3>单排 ${i}</h3>
                        <div class="form-group">
                            <label>胜率：</label>
                            <input type="number" class="survivor-winrate" min="0" max="100" step="0.1" placeholder="例如：52.5">
                            <span class="unit">%</span>
                        </div>
                    </div>
                `;
            }
            break;
        case '1-trio-1-solo':
            survivorInputs.innerHTML += `
                <div class="survivor-group">
                    <h3>三排</h3>
                    <div class="form-group">
                        <label>胜率：</label>
                        <input type="number" class="survivor-winrate" min="0" max="100" step="0.1" placeholder="例如：52.5">
                        <span class="unit">%</span>
                    </div>
                </div>
            `;
            survivorInputs.innerHTML += `
                <div class="survivor-group">
                    <h3>单排</h3>
                    <div class="form-group">
                        <label>胜率：</label>
                        <input type="number" class="survivor-winrate" min="0" max="100" step="0.1" placeholder="例如：52.5">
                        <span class="unit">%</span>
                    </div>
                </div>
            `;
            break;
        case '1-quad':
            survivorInputs.innerHTML += `
                <div class="survivor-group">
                    <h3>四排</h3>
                    <div class="form-group">
                        <label>胜率：</label>
                        <input type="number" class="survivor-winrate" min="0" max="100" step="0.1" placeholder="例如：52.5">
                        <span class="unit">%</span>
                    </div>
                </div>
            `;
            break;
    }
}

// 从胜率反解出elo分数（逻辑斯蒂函数的逆函数）
function winrateToElo(winrate) {
    // 防止除以零或取对数出错
    if (winrate <= 0) return -100; // 极低胜率
    if (winrate >= 100) return 100; // 极高胜率
    
    const p = winrate / 100;
    return Math.log(p / (1 - p));
}

// 计算胜率（逻辑斯蒂函数）
function eloToWinrate(elo) {
    return 100 / (1 + Math.exp(-elo));
}

// 计算胜率预测
function calculate() {
    // 获取监管者胜率
    const hunterWinrate = parseFloat(document.getElementById('hunter-winrate').value);
    if (isNaN(hunterWinrate)) {
        alert('请输入监管者胜率');
        return;
    }
    
    // 获取所有求生者胜率
    const survivorWinrateInputs = document.querySelectorAll('.survivor-winrate');
    const survivorWinrates = [];
    
    for (let input of survivorWinrateInputs) {
        const winrate = parseFloat(input.value);
        if (isNaN(winrate)) {
            alert('请输入所有求生者的胜率');
            return;
        }
        survivorWinrates.push(winrate);
    }
    
    // 计算监管者elo分数
    const hunterElo = winrateToElo(hunterWinrate);
    
    // 计算求生者总elo分数
    let survivorTotalElo = 0;
    for (let winrate of survivorWinrates) {
        survivorTotalElo += winrateToElo(winrate);
    }
    
    // 计算新的x值（监管者elo减去求生者总elo）
    const newX = hunterElo - survivorTotalElo;
    
    // 计算预测的监管者胜率
    const predictedHunterWinrate = eloToWinrate(newX);
    
    // 计算求生者胜率（两者之和为100%）
    const predictedSurvivorWinrate = 100 - predictedHunterWinrate;
    
    // 显示结果
    const results = document.getElementById('results');
    results.innerHTML = `
        <div class="result-item">监管者预测胜率：${predictedHunterWinrate.toFixed(2)}%</div>
        <div class="result-item">求生者预测胜率：${predictedSurvivorWinrate.toFixed(2)}%</div>
    `;
}

// 初始化表单
window.onload = function() {
    updateForm();
};