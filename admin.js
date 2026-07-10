// js/admin.js

let currentFilter = 'all';
let refreshInterval;

const STATUS_MAP = {
    pending: { text: '待处理', class: 'status-pending', next: 'making', btnText: '开始制作' },
    making: { text: '制作中', class: 'status-making', next: 'done', btnText: '制作完成' },
    done: { text: '已完成', class: 'status-done', next: 'paid', btnText: '已收款' },
    paid: { text: '已结账', class: 'status-paid', next: null, btnText: '-' }
};

function initAdmin() {
    renderOrders();
    updateStats();
    
    // 每3秒自动刷新
    refreshInterval = setInterval(() => {
        renderOrders();
        updateStats();
    }, 3000);
}

function filterOrders(status) {
    currentFilter = status;
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    renderOrders();
}

function renderOrders() {
    let orders = getOrders();
    
    if (currentFilter !== 'all') {
        orders = orders.filter(o => o.status === currentFilter);
    }
    
    // 按时间倒序
    orders.sort((a, b) => b.id - a.id);
    
    if (orders.length === 0) {
        document.getElementById('ordersList').innerHTML = '<p class="empty-orders">暂无订单</p>';
        return;
    }
    
    const ordersHtml = orders.map(order => {
        const status = STATUS_MAP[order.status];
        const itemsHtml = order.items.map(item => `
            <span class="order-item-tag">${item.name} x${item.quantity}</span>
        `).join('');
        
        return `
            <div class="order-card ${order.status}">
                <div class="order-header">
                    <div class="order-info">
                        <span class="order-id">#${order.id.toString().slice(-6)}</span>
                        <span class="table-num">🪑 ${order.tableNumber}号桌</span>
                        <span class="status-badge ${status.class}">${status.text}</span>
                    </div>
                    <span class="order-time">${order.createdAt}</span>
                </div>
                <div class="order-items">${itemsHtml}</div>
                <div class="order-footer">
                    <span class="order-total">合计：¥${order.totalPrice}</span>
                    ${status.next ? `
                        <button class="action-btn ${status.next}" onclick="changeStatus(${order.id}, '${status.next}')">
                            ${status.btnText}
                        </button>
                    ` : '<span class="done-text">已结束</span>'}
                </div>
            </div>
        `;
    }).join('');
    
    document.getElementById('ordersList').innerHTML = ordersHtml;
}

function changeStatus(orderId, newStatus) {
    updateOrderStatus(orderId, newStatus);
    renderOrders();
    updateStats();
    
    // 播放提示音（如果浏览器允许）
    if (newStatus === 'making') {
        playSound();
    }
}

function updateStats() {
    const orders = getOrders();
    const today = new Date().toDateString();
    
    const pending = orders.filter(o => o.status === 'pending').length;
    const making = orders.filter(o => o.status === 'making').length;
    const todayTotal = orders
        .filter(o => new Date(o.createdAt).toDateString() === today)
        .reduce((sum, o) => sum + o.totalPrice, 0);
    
    document.getElementById('pendingCount').textContent = pending;
    document.getElementById('makingCount').textContent = making;
    document.getElementById('todayTotal').textContent = `¥${todayTotal}`;
}

function playSound() {
    // 简单的提示音
    const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTGH0fPTgjMGHm7A7+OZSA0PVanu8LdnGgU1k9n1unEiBC13yO/eizEIHWq+8+OZURE');
    audio.play().catch(() => {});
}

// 启动
initAdmin();