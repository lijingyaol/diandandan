// js/data.js - 模拟数据库
const MENU_DATA = [
    {
        id: 1,
        name: "红烧肉",
        price: 38,
        category: "热菜",
        image: "🥩",
        available: true,
        description: "肥而不腻，入口即化"
    },
    {
        id: 2,
        name: "糖醋里脊",
        price: 32,
        category: "热菜",
        image: "🍖",
        available: true,
        description: "酸甜可口，外酥里嫩"
    },
    {
        id: 3,
        name: "麻婆豆腐",
        price: 18,
        category: "热菜",
        image: "🍲",
        available: true,
        description: "麻辣鲜香，下饭神器"
    },
    {
        id: 4,
        name: "蛋炒饭",
        price: 15,
        category: "主食",
        image: "🍚",
        available: true,
        description: "粒粒分明，香气扑鼻"
    },
    {
        id: 5,
        name: "扬州炒饭",
        price: 22,
        category: "主食",
        image: "🍛",
        available: true,
        description: "配料丰富，营养均衡"
    },
    {
        id: 6,
        name: "可乐",
        price: 8,
        category: "饮料",
        image: "🥤",
        available: true,
        description: "冰爽解渴"
    },
    {
        id: 7,
        name: "雪碧",
        price: 8,
        category: "饮料",
        image: "🧃",
        available: true,
        description: "清爽柠檬味"
    },
    {
        id: 8,
        name: "凉拌黄瓜",
        price: 12,
        category: "凉菜",
        image: "🥒",
        available: true,
        description: "清脆爽口，开胃小菜"
    }
];

// 模拟订单存储（实际会用 localStorage 或后端）
let orders = JSON.parse(localStorage.getItem('orders')) || [];

function saveOrder(order) {
    order.id = Date.now();
    order.status = 'pending';
    order.createdAt = new Date().toLocaleString();
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));
    return order;
}

function getOrders() {
    return JSON.parse(localStorage.getItem('orders')) || [];
}

function updateOrderStatus(orderId, status) {
    orders = getOrders();
    const order = orders.find(o => o.id === orderId);
    if (order) {
        order.status = status;
        localStorage.setItem('orders', JSON.stringify(orders));
    }
    return order;
}