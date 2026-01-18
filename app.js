// 数据初始化
let balance = parseFloat(localStorage.getItem("balance") || 0);
let debt = parseFloat(localStorage.getItem("debt") || 0);
let history = JSON.parse(localStorage.getItem("history") || "[]");
let schedule = JSON.parse(localStorage.getItem("schedule") || "[]");

// 更新界面
function updateUI(){
    document.getElementById("balance").innerText = balance.toFixed(2);
    document.getElementById("debt").innerText = debt.toFixed(2);
    // 更新历史记录
    let h = document.getElementById("history");
    h.innerHTML = "";
    history.forEach(r => {
        h.innerHTML += `
        <tr>
        <td>${r.time}</td>
        <td>${r.type}</td>
        <td>¥${r.amount}</td>
        <td>¥${r.balance}</td>
        <td>¥${r.debt}</td>
        <td>${r.reason}</td>
        </tr>`;
    });

    // 更新分期表
    let s = document.getElementById("schedule");
    s.innerHTML = "";
    schedule.forEach((r, i) => {
        s.innerHTML += `
        <tr class="${r.done ? 'gray' : ''}">
        <td>${i+1}</td>
        <td>¥${r.pay}</td>
        <td>
        ${r.done ? '已清零' : `<button class="clear-term" onclick="clearTerm(${i})">本期还清</button>`}
        </td>
        </tr>`;
    });
}

// 存款操作
function deposit() {
    let amt = parseFloat(amount.value);
    let rs = reason.value.trim();
    if (!rs) { alert("请输入原因"); return; }
    if (isNaN(amt) || amt <= 0) { alert("金额无效"); return; }
    balance += amt;
    addRecord("存入", amt, rs);
    updateUI();
}

// 贷款操作
function takeLoan() {
    let L = parseFloat(loanAmount.value);
    let r = parseFloat(interest.value) / 100;
    let N = parseInt(terms.value);
    if (isNaN(L) || isNaN(r) || isNaN(N) || N <= 0) { alert("请填写完整且期数>0"); return; }
    let totalRepay = L + L * r;
    let payPerTerm = totalRepay / N;
    balance += L;
    debt += totalRepay;
    addRecord("贷款到账", L, "贷款");
    schedule = [];
    for (let i = 0; i < N; i++) {
        schedule.push({ pay: payPerTerm.toFixed(2), done: false });
    }
    loanInfo.innerText = `应还总额 ¥${totalRepay.toFixed(2)}，每期 ¥${payPerTerm.toFixed(2)}，共 ${N} 期`;
    updateUI();
}

// 保存数据到本地存储
function saveData() {
    localStorage.setItem("balance", balance);
    localStorage.setItem("debt", debt);
    localStorage.setItem("history", JSON.stringify(history));
    localStorage.setItem("schedule", JSON.stringify(schedule));
    alert("已保存");
}

// 清空数据
function resetData() {
    if (confirm("确定清空？")) {
        localStorage.clear();
        balance = 0;
        debt = 0;
        history = [];
        schedule = [];
        updateUI();
    }
}
