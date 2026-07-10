// js/customer.js

let cart = {};
let currentCategory = '全部';

// 初始化
function init() {
    renderCategories();
    renderMenu();
    updateCartBar();
    
    // 从 URL 获取桌号
    const urlParams = new URLSearchParams(window.location.search);
    const table = urlParams.get('table');
    if (table) {
        document.getElementById('tableNumber').value = table;
    }
}

// 渲染分类标签
function renderCategories() {
    const categories = ['全部', ...new Set(MENU_DATA.map(item => item.category))];
    const tabsHtml = categories.map(cat => `
        <button class="tab ${cat === currentCategory ? 'active' : ''}" 
                onclick="switchCategory('${cat}')">${cat}</button>
    `).join('');
    document.getElementById('categoryTabs').innerHTML = tabsHtml;
}

// 切换分类
function switchCategory(category) {
    currentCategory = category;
    renderCategories();
    renderMenu();
}

// 渲染菜单
function renderMenu() {
    const filtered = currentCategory === '全部' 
        ? MENU_DATA 
        : MENU_DATA.filter(item => item.category === currentCategory);
    
    const menuHtml = filtered.map(item => `
        <div class="menu-item" data-id="${item.id}">
            <div class="item-image">${item.image}</div>
            <div class="item-info">
                <h3>${item.name}</h3>
                <p class="desc">${item.description}</p>
                <div class="item-bottom">
                    <span class="price">¥${item.price}</span>
                    <div class="quantity-control">
                        ${cart[item.id] ? `
                            <button onclick="changeQty(${item.id}, -1)">−</button>
                            <span>${cart[item.id]}</span>
                        ` : ''}
                        <button onclick="changeQty(${item.id}, 1)">+</button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
    
    document.getElementById('menuList').innerHTML = menuHtml || '<p class="empty">暂无菜品</p>';
}

// 修改数量
function changeQty(itemId, delta) {
    if (!cart[itemId]) cart[itemId] = 0;
    cart[itemId] += delta;
    if (cart[itemId] <= 0) delete cart[itemId];
    renderMenu();
    updateCartBar();
}

// 更新购物车栏
function updateCartBar() {
    const items = Object.entries(cart);
    const count = items.reduce((sum, [, qty]) => sum + qty, 0);
    const total = items.reduce((sum, [id, qty]) => {
        const item = MENU_DATA.find(m => m.id == id);
        return sum + (item ? item.price * qty : 0);
    }, 0);
    
    document.getElementById('cartCount').textContent = count;
    document.getElementById('cartTotal').textContent = total;
    document.getElementById('cartBar').style.display = count > 0 ? 'flex' : 'none';
}

// 切换购物车弹窗
function toggleCart() {
    const modal = document.getElementById('cartModal');
    if (modal.style.display === 'flex') {
        modal.style.display = 'none';
    } else {
        renderCartItems();
        modal.style.display = 'flex';
    }
}

// 渲染购物车内容
function renderCartItems() {
    const items = Object.entries(cart);
    const total = items.reduce((sum, [id, qty]) => {
        const item = MENU_DATA.find(m => m.id == id);
        return sum + (item ? item.price * qty : 0);
    }, 0);
    
    const itemsHtml = items.map(([id, qty]) => {
        const item = MENU_DATA.find(m => m.id == id);
        return `
            <div class="cart-item">
                <span class="cart-item-name">${item.image} ${item.name}</span>
                <div class="cart-item-right">
                    <span class="cart-item-price">¥${item.price * qty}</span>
                    <div class="quantity-control">
                        <button onclick="changeQty(${id}, -1); renderCartItems();">−</button>
                        <span>${qty}</span>
                        <button onclick="changeQty(${id}, 1); renderCartItems();">+</button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    document.getElementById('cartItems').innerHTML = itemsHtml || '<p class="empty-cart">购物车是空的</p>';
    document.getElementById('modalTotal').textContent = total;
}

// 提交订单
function submitOrder(event) {
    event.stopPropagation();
    const tableNumber = document.getElementById('tableNumber').value.trim();
    if (!tableNumber) {
        alert('请输入桌号！');
        return;
    }
    
    const items = Object.entries(cart).map(([id, qty]) => {
        const item = MENU_DATA.find(m => m.id == id);
        return { ...item, quantity: qty };
    });
    
    if (items.length === 0) {
        alert('请先选择菜品！');
        return;
    }
    
    const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    
    const order = {
        tableNumber,
        items,
        totalPrice
    };
    
    const savedOrder = saveOrder(order);
    
    // 清空购物车
    cart = {};
    renderMenu();
    updateCartBar();
    document.getElementById('cartModal').style.display = 'none';
    
    // 显示成功弹窗
    document.getElementById('orderId').textContent = savedOrder.id;
    document.getElementById('successModal').style.display = 'flex';
}

function closeSuccess() {
    document.getElementById('successModal').style.display = 'none';
}

// 启动
init();