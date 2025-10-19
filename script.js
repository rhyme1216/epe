// 模拟数据生成
let mockData = [];
let currentPage = 1;
let pageSize = 20;
let totalRecords = 0;
let filteredData = [];
let currentAssessmentItem = null; // 当前正在评估的项目

// 报关管理数据
let customsData = [];
let customsCurrentPage = 1;
let customsPageSize = 20;
let customsTotalRecords = 0;
let customsFilteredData = [];
let currentCustomsStatus = 'export-pre'; // 当前选中的报关状态
let currentCustomsDetail = null; // 当前查看详情的报关单
let currentActionType = ''; // 当前操作类型
let uploadedFiles = { export: [], import: [] }; // 已上传的文件

// 初始化页面
document.addEventListener('DOMContentLoaded', function() {
    // 默认展开第一个菜单
    const firstMenu = document.querySelector('.menu-item');
    if (firstMenu) {
        firstMenu.classList.add('active');
    }
    
    // 生成模拟数据
    generateMockData();
    
    // 渲染表格
    renderTable();
    
    // 生成报关管理模拟数据
    generateCustomsData();
    
    // 渲染报关表格（如果当前在报关页面）
    renderCustomsTable();
});

// 生成模拟数据
function generateMockData() {
    const statuses = ['pending', 'confirming', 'completed'];
    const statusNames = ['待评估', '待确认', '已评估'];
    const productTypes = ['cross-border', 'local'];
    const productTypeNames = ['跨境', '本土'];
    const customers = ['客户A', '客户B', '客户C', '客户D', '客户E'];
    const brands = ['品牌A', '品牌B', '品牌C', '品牌D', '品牌E'];
    const categories = ['电子产品', '日用品', '服装', '食品', '化妆品'];
    const productStatus = ['上架', '下架'];
    const creators = ['张三', '李四', '王五', '赵六', '钱七'];
    
    mockData = [];
    
    for (let i = 1; i <= 100; i++) {
        const statusIndex = Math.floor(Math.random() * statuses.length);
        const typeIndex = Math.floor(Math.random() * productTypes.length);
        const hasCustomerOrder = Math.random() > 0.5;
        const hasCustomerMaterialNo = Math.random() > 0.3;
        
        const createTime = new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1);
        const updateTime = new Date(createTime.getTime() + Math.random() * 30 * 24 * 60 * 60 * 1000);
        
        mockData.push({
            id: i,
            intlSku: `SKU${1000 + i}`,
            intlMku: `MKU${2000 + i}`,
            domesticSku: `DSKU${4000 + i}`,
            domesticSkuLink: `https://www.example.com/product/${4000 + i}`,
            customerMaterialNo: hasCustomerMaterialNo ? `CMN${3000 + i}` : '',
            customerName: customers[Math.floor(Math.random() * customers.length)],
            productNameCn: `商品${i}`,
            hsCode: `${1000 + Math.floor(Math.random() * 9000)}.${Math.floor(Math.random() * 100)}`,
            productNameVn: `Sản phẩm ${i}`,
            productImage: `https://via.placeholder.com/50?text=P${i}`,
            unitCn: ['个', '件', '套', '箱', '包'][Math.floor(Math.random() * 5)],
            unitVn: ['cái', 'chiếc', 'bộ', 'thùng', 'gói'][Math.floor(Math.random() * 5)],
            description: `这是商品${i}的详细描述信息`,
            productType: productTypes[typeIndex],
            productTypeName: productTypeNames[typeIndex],
            erpSystem: ['ERP-A', 'ERP-B', 'ERP-C'][Math.floor(Math.random() * 3)],
            createTime: formatDateTime(createTime),
            assessmentStatus: statuses[statusIndex],
            assessmentStatusName: statusNames[statusIndex],
            hasCustomerOrder: hasCustomerOrder,
            brandName: brands[Math.floor(Math.random() * brands.length)],
            category: categories[Math.floor(Math.random() * categories.length)],
            productStatus: productStatus[Math.floor(Math.random() * productStatus.length)],
            declarationElements: `品牌:${brands[Math.floor(Math.random() * brands.length)]};型号:${i};用途:测试`,
            remark: Math.random() > 0.7 ? `备注信息${i}` : '',
            updater: creators[Math.floor(Math.random() * creators.length)],
            updateTime: formatDateTime(updateTime),
            creator: creators[Math.floor(Math.random() * creators.length)]
        });
    }
    
    filteredData = [...mockData];
    totalRecords = filteredData.length;
}

// 格式化日期时间
function formatDateTime(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

// 切换子菜单
function toggleSubmenu(element) {
    const menuItem = element.parentElement;
    const isActive = menuItem.classList.contains('active');
    
    // 关闭所有菜单
    document.querySelectorAll('.menu-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // 切换当前菜单
    if (!isActive) {
        menuItem.classList.add('active');
    }
}

// 加载页面
function loadPage(pageName) {
    // 移除所有活动状态
    document.querySelectorAll('.submenu-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // 设置当前活动状态
    event.target.classList.add('active');
    
    // 隐藏所有页面
    document.querySelectorAll('.page-content').forEach(page => {
        page.classList.remove('active');
    });
    
    // 显示对应页面
    if (pageName === 'vietnam-epe-evaluation') {
        document.getElementById('page-evaluation').classList.add('active');
    } else if (pageName === 'vietnam-epe-customs') {
        document.getElementById('page-customs').classList.add('active');
        renderCustomsTable();
    }
}

// 渲染表格
function renderTable() {
    const tableBody = document.getElementById('tableBody');
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    const pageData = filteredData.slice(start, end);
    
    tableBody.innerHTML = '';
    
    if (pageData.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="26" style="text-align: center; padding: 40px; color: #999;">暂无数据</td></tr>';
        return;
    }
    
    pageData.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><input type="checkbox" class="row-checkbox" value="${item.id}" onchange="updateSelectedCount()"></td>
            <td>${item.intlSku}</td>
            <td>${item.intlMku}</td>
            <td>${item.customerMaterialNo || '-'}</td>
            <td>${item.customerName}</td>
            <td title="${item.productNameCn}">${item.productNameCn}</td>
            <td>${item.hsCode}</td>
            <td title="${item.productNameVn}">${item.productNameVn}</td>
            <td><img src="${item.productImage}" alt="商品图片" class="product-image" onclick="viewImage('${item.productImage}')"></td>
            <td>${item.unitCn}</td>
            <td>${item.unitVn}</td>
            <td><div style="max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${item.description}">${item.description}</div></td>
            <td><span class="type-badge type-${item.productType}">${item.productTypeName}</span></td>
            <td>${item.erpSystem}</td>
            <td style="min-width: 160px;">${item.createTime}</td>
            <td><span class="status-badge status-${item.assessmentStatus}">${item.assessmentStatusName}</span></td>
            <td>${item.hasCustomerOrder ? '是' : '否'}</td>
            <td title="${item.brandName}">${item.brandName}</td>
            <td title="${item.category}">${item.category}</td>
            <td>${item.productStatus}</td>
            <td><div style="max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${item.declarationElements}">${item.declarationElements}</div></td>
            <td title="${item.remark || '-'}">${item.remark || '-'}</td>
            <td title="${item.updater}">${item.updater}</td>
            <td style="min-width: 160px;">${item.updateTime}</td>
            <td>${item.creator}</td>
            <td>
                ${getActionButtons(item)}
            </td>
        `;
        tableBody.appendChild(row);
    });
    
    // 更新分页信息
    document.getElementById('totalRecords').textContent = totalRecords;
    document.getElementById('currentPage').value = currentPage;
    
    // 更新全选复选框状态
    updateCheckAllState();
    // 更新选中计数
    updateSelectedCount();
}

// 全选/取消全选
function toggleCheckAll(checkbox) {
    const checkboxes = document.querySelectorAll('.row-checkbox');
    checkboxes.forEach(cb => {
        cb.checked = checkbox.checked;
    });
    updateSelectedCount();
}

// 更新全选复选框状态
function updateCheckAllState() {
    const checkboxes = document.querySelectorAll('.row-checkbox');
    const checkAll = document.getElementById('checkAll');
    
    if (checkboxes.length === 0) {
        checkAll.checked = false;
        checkAll.indeterminate = false;
        return;
    }
    
    const checkedCount = Array.from(checkboxes).filter(cb => cb.checked).length;
    
    if (checkedCount === 0) {
        checkAll.checked = false;
        checkAll.indeterminate = false;
    } else if (checkedCount === checkboxes.length) {
        checkAll.checked = true;
        checkAll.indeterminate = false;
    } else {
        checkAll.checked = false;
        checkAll.indeterminate = true;
    }
}

// 更新选中计数
function updateSelectedCount() {
    const checkboxes = document.querySelectorAll('.row-checkbox');
    const checkedCount = Array.from(checkboxes).filter(cb => cb.checked).length;
    document.getElementById('selectedCount').innerHTML = `已选择 <strong>${checkedCount}</strong> 条`;
    updateCheckAllState();
}

// 获取选中的项目ID
function getSelectedIds() {
    const checkboxes = document.querySelectorAll('.row-checkbox:checked');
    return Array.from(checkboxes).map(cb => parseInt(cb.value));
}

// 获取选中的项目数据
function getSelectedItems() {
    const ids = getSelectedIds();
    return mockData.filter(item => ids.includes(item.id));
}

// 根据关务评估状态生成操作按钮
function getActionButtons(item) {
    let buttons = '';
    
    if (item.assessmentStatus === 'pending') {
        // 待评估：关务评估、详情、删除
        buttons = `
            <div class="action-btns">
                <div class="action-btn-row">
                    <button class="action-btn" onclick="handleAssessment(${item.id})">关务评估</button>
                    <button class="action-btn" onclick="handleView(${item.id})">详情</button>
                </div>
                <div class="action-btn-row">
                    <button class="action-btn" onclick="handleDelete(${item.id})">删除</button>
                </div>
            </div>
        `;
    } else if (item.assessmentStatus === 'confirming') {
        // 待确认：关务评估、关务确认、详情、删除
        buttons = `
            <div class="action-btns">
                <div class="action-btn-row">
                    <button class="action-btn" onclick="handleAssessment(${item.id})">关务评估</button>
                    <button class="action-btn" onclick="handleConfirm(${item.id})">关务确认</button>
                </div>
                <div class="action-btn-row">
                    <button class="action-btn" onclick="handleView(${item.id})">详情</button>
                    <button class="action-btn" onclick="handleDelete(${item.id})">删除</button>
                </div>
            </div>
        `;
    } else if (item.assessmentStatus === 'completed') {
        // 已评估：关务评估、详情、删除
        buttons = `
            <div class="action-btns">
                <div class="action-btn-row">
                    <button class="action-btn" onclick="handleAssessment(${item.id})">关务评估</button>
                    <button class="action-btn" onclick="handleView(${item.id})">详情</button>
                </div>
                <div class="action-btn-row">
                    <button class="action-btn" onclick="handleDelete(${item.id})">删除</button>
                </div>
            </div>
        `;
    }
    
    return buttons;
}

// 查询
function handleSearch() {
    const intlSku = document.getElementById('intlSku').value.trim();
    const intlMku = document.getElementById('intlMku').value.trim();
    const customerName = document.getElementById('customerName').value.trim();
    const hsCode = document.getElementById('hsCode').value.trim();
    const hasCustomerOrder = document.getElementById('hasCustomerOrder').value;
    const creator = document.getElementById('creator').value.trim();
    const createTimeStart = document.getElementById('createTimeStart').value;
    const createTimeEnd = document.getElementById('createTimeEnd').value;
    const assessmentStatus = document.getElementById('assessmentStatus').value;
    const productType = document.getElementById('productType').value;
    
    // 过滤数据
    filteredData = mockData.filter(item => {
        let match = true;
        
        if (intlSku && !item.intlSku.includes(intlSku)) {
            match = false;
        }
        
        if (intlMku) {
            const mkuList = intlMku.split(/[,\n]/).map(s => s.trim()).filter(s => s);
            if (mkuList.length > 0 && !mkuList.some(mku => item.intlMku.includes(mku))) {
                match = false;
            }
        }
        
        if (customerName && !item.customerName.includes(customerName)) {
            match = false;
        }
        
        if (hsCode && !item.hsCode.includes(hsCode)) {
            match = false;
        }
        
        if (hasCustomerOrder !== '' && item.hasCustomerOrder !== (hasCustomerOrder === '1')) {
            match = false;
        }
        
        if (creator && !item.creator.includes(creator)) {
            match = false;
        }
        
        if (createTimeStart && item.createTime < createTimeStart) {
            match = false;
        }
        
        if (createTimeEnd && item.createTime > createTimeEnd + ' 23:59:59') {
            match = false;
        }
        
        if (assessmentStatus && item.assessmentStatus !== assessmentStatus) {
            match = false;
        }
        
        if (productType && item.productType !== productType) {
            match = false;
        }
        
        return match;
    });
    
    totalRecords = filteredData.length;
    currentPage = 1;
    renderTable();
}

// 重置
function handleReset() {
    document.getElementById('intlSku').value = '';
    document.getElementById('intlMku').value = '';
    document.getElementById('customerName').value = '';
    document.getElementById('hsCode').value = '';
    document.getElementById('hasCustomerOrder').value = '';
    document.getElementById('creator').value = '';
    document.getElementById('createTimeStart').value = '';
    document.getElementById('createTimeEnd').value = '';
    document.getElementById('assessmentStatus').value = '';
    document.getElementById('productType').value = '';
    
    filteredData = [...mockData];
    totalRecords = filteredData.length;
    currentPage = 1;
    renderTable();
}

// 导出
function handleExport() {
    const selectedIds = getSelectedIds();
    if (selectedIds.length === 0) {
        alert('请至少选择一条数据进行导出');
        return;
    }
    
    const selectedItems = getSelectedItems();
    alert(`导出功能：将导出选中的 ${selectedIds.length} 条数据`);
    console.log('导出数据：', selectedItems);
}

// 批量关务确认
function handleBatchConfirm() {
    const selectedIds = getSelectedIds();
    if (selectedIds.length === 0) {
        alert('请至少选择一条数据进行批量关务确认');
        return;
    }
    
    const selectedItems = getSelectedItems();
    
    // 检查是否都是待确认状态
    const confirmingItems = selectedItems.filter(item => item.assessmentStatus === 'confirming');
    
    if (confirmingItems.length === 0) {
        alert('选中的数据中没有"待确认"状态的记录');
        return;
    }
    
    if (confirm(`确认对 ${confirmingItems.length} 条"待确认"状态的记录进行批量关务确认？`)) {
        // 更新状态为已评估
        confirmingItems.forEach(item => {
            item.assessmentStatus = 'completed';
            item.assessmentStatusName = '已评估';
        });
        
        alert(`批量关务确认成功！已确认 ${confirmingItems.length} 条记录`);
        console.log('批量确认数据：', confirmingItems);
        
        // 刷新表格
        renderTable();
    }
}

// 批量关务评估（下载Excel模板）
function handleBatchAssessment() {
    const selectedIds = getSelectedIds();
    if (selectedIds.length === 0) {
        alert('请至少选择一条数据进行批量关务评估');
        return;
    }
    
    const selectedItems = getSelectedItems();
    
    // 模拟下载Excel模板
    alert(`批量关务评估功能：\n已选择 ${selectedIds.length} 条数据\n正在下载Excel模板...\n\n请在Excel中填写评估信息后重新导入`);
    console.log('批量评估数据：', selectedItems);
    
    // 实际项目中，这里应该生成Excel文件并下载
    // 示例：创建一个包含选中数据的CSV内容
    generateExcelTemplate(selectedItems);
}

// 生成Excel模板（模拟）
function generateExcelTemplate(items) {
    // 创建CSV内容
    const headers = ['国际SKU', '国际MKU', '客户名称', '商品中文名称', 'HSCode', '货物描述', '备注'];
    const rows = items.map(item => [
        item.intlSku,
        item.intlMku,
        item.customerName,
        item.productNameCn,
        item.hsCode,
        item.description,
        ''
    ]);
    
    let csvContent = headers.join(',') + '\n';
    rows.forEach(row => {
        csvContent += row.map(cell => `"${cell}"`).join(',') + '\n';
    });
    
    // 创建下载链接
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `批量关务评估模板_${new Date().getTime()}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    console.log('Excel模板已生成下载');
}

// ==================== 报关管理相关功能 ====================

// 生成报关管理模拟数据
function generateCustomsData() {
    const statuses = ['export-pre', 'export-pending', 'export-declaring', 'export-inspecting', 'export-released', 
                     'import-pending', 'import-inspecting', 'import-released'];
    const statusNames = ['出口预报关', '出口待报关', '出口报关中', '出口查验中', '出口已放行', 
                        '进口待报关', '进口查验中', '进口已放行'];
    const warnings = ['red', 'yellow', 'green', 'null'];
    const warningNames = ['红灯', '黄灯', '绿灯', 'NULL'];
    const updaters = ['张三', '李四', '王五', '赵六', '钱七'];
    
    customsData = [];
    
    for (let i = 1; i <= 100; i++) {
        const statusIndex = Math.floor(Math.random() * statuses.length);
        const warningIndex = Math.floor(Math.random() * warnings.length);
        const status = statuses[statusIndex];
        const isExport = status.startsWith('export');
        
        const createTime = new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1);
        const updateTime = new Date(createTime.getTime() + Math.random() * 30 * 24 * 60 * 60 * 1000);
        
        // 根据状态决定放行日期
        let exportReleaseDate = '';
        let importReleaseDate = '';
        
        if (status === 'export-released') {
            exportReleaseDate = formatDate(updateTime);
        }
        if (status === 'import-released') {
            importReleaseDate = formatDate(updateTime);
        }
        
        customsData.push({
            id: i,
            batchNo: `BATCH${2024}${String(i).padStart(4, '0')}`,
            customerCode: `CUST${String(Math.floor(Math.random() * 5) + 1).padStart(3, '0')}`,
            status: status,
            statusName: statusNames[statusIndex],
            warning: warnings[warningIndex],
            warningName: warningNames[warningIndex],
            exportWarning: isExport && Math.random() > 0.3 ? warnings[warningIndex] : '',
            importWarning: !isExport && Math.random() > 0.3 ? warnings[warningIndex] : '',
            exportReleaseDate: exportReleaseDate,
            importReleaseDate: importReleaseDate,
            updater: updaters[Math.floor(Math.random() * updaters.length)],
            updateTime: formatDateTime(updateTime)
        });
    }
    
    // 初始化过滤数据
    filterCustomsDataByStatus(currentCustomsStatus);
    updateCustomsStatusBadges();
}

// 格式化日期（不含时间）
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// 切换报关状态TAB
function switchCustomsTab(element, status) {
    // 移除所有活动状态
    document.querySelectorAll('.tab-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // 设置当前活动状态
    element.classList.add('active');
    currentCustomsStatus = status;
    
    // 重置搜索条件
    handleCustomsReset();
}

// 根据状态过滤数据
function filterCustomsDataByStatus(status) {
    customsFilteredData = customsData.filter(item => item.status === status);
    customsTotalRecords = customsFilteredData.length;
    customsCurrentPage = 1;
    
    // 自动渲染表格
    if (document.getElementById('customsTableBody')) {
        renderCustomsTable();
    }
}

// 更新状态徽标数字
function updateCustomsStatusBadges() {
    const statuses = ['export-pre', 'export-pending', 'export-declaring', 'export-inspecting', 'export-released', 
                     'import-pending', 'import-inspecting', 'import-released'];
    
    statuses.forEach(status => {
        const count = customsData.filter(item => item.status === status).length;
        const badge = document.getElementById(`badge-${status}`);
        if (badge) {
            badge.textContent = count;
        }
    });
}

// 渲染报关表格
function renderCustomsTable() {
    const tableBody = document.getElementById('customsTableBody');
    
    // 如果表格不存在（页面未加载），直接返回
    if (!tableBody) {
        return;
    }
    
    const start = (customsCurrentPage - 1) * customsPageSize;
    const end = start + customsPageSize;
    const pageData = customsFilteredData.slice(start, end);
    
    tableBody.innerHTML = '';
    
    if (pageData.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="8" style="text-align: center; padding: 40px; color: #999;">暂无数据</td></tr>';
        return;
    }
    
    pageData.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.batchNo}</td>
            <td>${item.statusName}</td>
            <td><span class="warning-badge warning-${item.warning}">${item.warningName}</span></td>
            <td>${item.exportReleaseDate || '-'}</td>
            <td>${item.importReleaseDate || '-'}</td>
            <td>${item.updater}</td>
            <td>${item.updateTime}</td>
            <td>
                ${getCustomsActionButtons(item)}
            </td>
        `;
        tableBody.appendChild(row);
    });
    
    // 更新分页信息
    document.getElementById('customsTotalRecords').textContent = customsTotalRecords;
    document.getElementById('customsCurrentPage').value = customsCurrentPage;
    
    // 更新当前页码输入框事件监听
    const pageInput = document.getElementById('customsCurrentPage');
    if (pageInput && !pageInput.dataset.listenerAdded) {
        pageInput.addEventListener('change', function() {
            const newPage = parseInt(this.value);
            const totalPages = Math.ceil(customsTotalRecords / customsPageSize);
            
            if (newPage >= 1 && newPage <= totalPages) {
                customsCurrentPage = newPage;
                renderCustomsTable();
            } else {
                this.value = customsCurrentPage;
                alert(`请输入1到${totalPages}之间的页码`);
            }
        });
        pageInput.dataset.listenerAdded = 'true';
    }
}

// 根据报关状态生成操作按钮
function getCustomsActionButtons(item) {
    let buttons = '';
    
    switch(item.status) {
        case 'export-pre':
            // 出口预报关：详情
            buttons = `
                <div class="action-btns">
                    <div class="action-btn-row">
                        <button class="action-btn" onclick="handleCustomsDetail(${item.id})">详情</button>
                    </div>
                </div>
            `;
            break;
        case 'export-pending':
            // 出口待报关：确认报关、详情
            buttons = `
                <div class="action-btns">
                    <div class="action-btn-row">
                        <button class="action-btn" onclick="handleConfirmDeclaration(${item.id})">确认报关</button>
                        <button class="action-btn" onclick="handleCustomsDetail(${item.id})">详情</button>
                    </div>
                </div>
            `;
            break;
        case 'export-declaring':
            // 出口报关中：取消确认、海关查验、海关放行、详情
            buttons = `
                <div class="action-btns">
                    <div class="action-btn-row">
                        <button class="action-btn" onclick="handleCancelConfirm(${item.id})">取消确认</button>
                        <button class="action-btn" onclick="handleCustomsInspection(${item.id})">海关查验</button>
                    </div>
                    <div class="action-btn-row">
                        <button class="action-btn" onclick="handleCustomsRelease(${item.id})">海关放行</button>
                        <button class="action-btn" onclick="handleCustomsDetail(${item.id})">详情</button>
                    </div>
                </div>
            `;
            break;
        case 'export-inspecting':
            // 出口查验中：取消确认、海关放行、详情
            buttons = `
                <div class="action-btns">
                    <div class="action-btn-row">
                        <button class="action-btn" onclick="handleCancelConfirm(${item.id})">取消确认</button>
                        <button class="action-btn" onclick="handleCustomsRelease(${item.id})">海关放行</button>
                    </div>
                    <div class="action-btn-row">
                        <button class="action-btn" onclick="handleCustomsDetail(${item.id})">详情</button>
                    </div>
                </div>
            `;
            break;
        case 'export-released':
            // 出口已放行：取消确认、详情
            buttons = `
                <div class="action-btns">
                    <div class="action-btn-row">
                        <button class="action-btn" onclick="handleCancelConfirm(${item.id})">取消确认</button>
                        <button class="action-btn" onclick="handleCustomsDetail(${item.id})">详情</button>
                    </div>
                </div>
            `;
            break;
        case 'import-pending':
            // 进口待报关：海关查验、海关放行、详情
            buttons = `
                <div class="action-btns">
                    <div class="action-btn-row">
                        <button class="action-btn" onclick="handleCustomsInspection(${item.id})">海关查验</button>
                        <button class="action-btn" onclick="handleCustomsRelease(${item.id})">海关放行</button>
                    </div>
                    <div class="action-btn-row">
                        <button class="action-btn" onclick="handleCustomsDetail(${item.id})">详情</button>
                    </div>
                </div>
            `;
            break;
        case 'import-inspecting':
            // 进口查验中：取消确认、海关放行、详情
            buttons = `
                <div class="action-btns">
                    <div class="action-btn-row">
                        <button class="action-btn" onclick="handleCancelConfirm(${item.id})">取消确认</button>
                        <button class="action-btn" onclick="handleCustomsRelease(${item.id})">海关放行</button>
                    </div>
                    <div class="action-btn-row">
                        <button class="action-btn" onclick="handleCustomsDetail(${item.id})">详情</button>
                    </div>
                </div>
            `;
            break;
        case 'import-released':
            // 进口已放行：取消确认、详情
            buttons = `
                <div class="action-btns">
                    <div class="action-btn-row">
                        <button class="action-btn" onclick="handleCancelConfirm(${item.id})">取消确认</button>
                        <button class="action-btn" onclick="handleCustomsDetail(${item.id})">详情</button>
                    </div>
                </div>
            `;
            break;
    }
    
    return buttons;
}

// 报关查询
function handleCustomsSearch() {
    const batchNo = document.getElementById('customs_batchNo').value.trim();
    const customerCode = document.getElementById('customs_customerCode').value.trim();
    const warning = document.getElementById('customs_inspectionWarning').value;
    
    // 先根据状态过滤
    customsFilteredData = customsData.filter(item => item.status === currentCustomsStatus);
    
    // 再根据搜索条件过滤
    if (batchNo) {
        customsFilteredData = customsFilteredData.filter(item => item.batchNo.includes(batchNo));
    }
    
    if (customerCode) {
        customsFilteredData = customsFilteredData.filter(item => item.customerCode.includes(customerCode));
    }
    
    if (warning) {
        customsFilteredData = customsFilteredData.filter(item => item.warning === warning);
    }
    
    customsTotalRecords = customsFilteredData.length;
    customsCurrentPage = 1;
    renderCustomsTable();
}

// 报关重置
function handleCustomsReset() {
    document.getElementById('customs_batchNo').value = '';
    document.getElementById('customs_customerCode').value = '';
    document.getElementById('customs_inspectionWarning').value = '';
    
    filterCustomsDataByStatus(currentCustomsStatus);
    renderCustomsTable();
}

// 报关导出
function handleCustomsExport() {
    alert(`导出功能：将导出当前${customsFilteredData[0]?.statusName || ''}状态的所有数据\n共 ${customsFilteredData.length} 条记录`);
    console.log('导出数据：', customsFilteredData);
}

// 报关分页切换
function handleCustomsPageChange(action) {
    const totalPages = Math.ceil(customsTotalRecords / customsPageSize);
    
    if (action === 'prev' && customsCurrentPage > 1) {
        customsCurrentPage--;
    } else if (action === 'next' && customsCurrentPage < totalPages) {
        customsCurrentPage++;
    }
    
    renderCustomsTable();
}

// 修改每页显示条数
function handleCustomsPageSizeChange() {
    customsPageSize = parseInt(document.getElementById('customsPageSize').value);
    customsCurrentPage = 1;
    renderCustomsTable();
}

// 确认报关
function handleConfirmDeclaration(id) {
    const item = customsData.find(d => d.id === id);
    if (confirm(`确认对批次号 ${item.batchNo} 进行报关确认？`)) {
        alert(`确认报关成功！\n批次号：${item.batchNo}`);
        console.log('确认报关：', item);
    }
}

// 取消确认
function handleCancelConfirm(id) {
    const item = customsData.find(d => d.id === id);
    if (confirm(`确认取消批次号 ${item.batchNo} 的确认操作？`)) {
        alert(`取消确认成功！\n批次号：${item.batchNo}`);
        console.log('取消确认：', item);
    }
}

// 海关查验
function handleCustomsInspection(id) {
    const item = customsData.find(d => d.id === id);
    if (!item) return;
    
    currentCustomsDetail = item;
    currentActionType = 'inspection';
    
    showCustomsDetail(item);
    
    // 启用对应的查验预警字段
    const isExport = item.status.startsWith('export');
    
    if (isExport) {
        document.getElementById('detail_exportWarning').disabled = false;
        document.getElementById('detail_exportWarning').style.display = 'block';
        document.getElementById('detail_exportWarning_display').style.display = 'none';
    } else {
        document.getElementById('detail_importWarning').disabled = false;
        document.getElementById('detail_importWarning').style.display = 'block';
        document.getElementById('detail_importWarning_display').style.display = 'none';
    }
    
    // 显示保存按钮
    document.getElementById('saveDetailBtn').style.display = 'inline-block';
}

// 海关放行
function handleCustomsRelease(id) {
    const item = customsData.find(d => d.id === id);
    if (!item) return;
    
    currentCustomsDetail = item;
    currentActionType = 'release';
    
    showCustomsDetail(item);
    
    // 启用对应的放行日期和文件上传
    const isExport = item.status.startsWith('export');
    
    if (isExport) {
        document.getElementById('detail_exportReleaseDate').disabled = false;
        document.getElementById('detail_exportReleaseDate').style.display = 'block';
        document.getElementById('detail_exportReleaseDate_display').style.display = 'none';
        document.getElementById('exportUploadBtn').disabled = false;
    } else {
        document.getElementById('detail_importReleaseDate').disabled = false;
        document.getElementById('detail_importReleaseDate').style.display = 'block';
        document.getElementById('detail_importReleaseDate_display').style.display = 'none';
        document.getElementById('importUploadBtn').disabled = false;
    }
    
    // 显示保存按钮
    document.getElementById('saveDetailBtn').style.display = 'inline-block';
}

// 报关详情
function handleCustomsDetail(id) {
    const item = customsData.find(d => d.id === id);
    if (!item) return;
    
    currentCustomsDetail = item;
    currentActionType = 'view';
    
    // 显示详情页
    showCustomsDetail(item);
}

// 显示报关单详情
function showCustomsDetail(item) {
    // 填充基本信息
    document.getElementById('detail_batchNo').textContent = item.batchNo;
    
    const statusSpan = document.getElementById('detail_status');
    statusSpan.textContent = item.statusName;
    statusSpan.className = 'status-badge';
    
    // 根据状态决定字段的显示和编辑状态
    const isExport = item.status.startsWith('export');
    const isImport = item.status.startsWith('import');
    
    // 出口相关字段
    const exportWarningSection = document.getElementById('exportWarningSection');
    const exportReleaseDateSection = document.getElementById('exportReleaseDateSection');
    const exportDocSection = document.getElementById('exportDocSection');
    
    if (isExport) {
        exportWarningSection.style.display = 'flex';
        exportReleaseDateSection.style.display = 'flex';
        exportDocSection.style.display = 'flex';
        
        // 显示查验预警
        if (item.exportWarning) {
            document.getElementById('detail_exportWarning_display').innerHTML = 
                `<span class="warning-badge warning-${item.exportWarning}">${getWarningName(item.exportWarning)}</span>`;
            document.getElementById('detail_exportWarning_display').style.display = 'inline-block';
            document.getElementById('detail_exportWarning').style.display = 'none';
        }
        
        // 显示放行日期
        if (item.exportReleaseDate) {
            document.getElementById('detail_exportReleaseDate_display').textContent = item.exportReleaseDate;
            document.getElementById('detail_exportReleaseDate_display').style.display = 'inline-block';
            document.getElementById('detail_exportReleaseDate').style.display = 'none';
        }
    } else {
        exportWarningSection.style.display = 'none';
        exportReleaseDateSection.style.display = 'none';
        exportDocSection.style.display = 'none';
    }
    
    // 进口相关字段
    const importWarningSection = document.getElementById('importWarningSection');
    const importReleaseDateSection = document.getElementById('importReleaseDateSection');
    const importDocSection = document.getElementById('importDocSection');
    
    if (isImport) {
        importWarningSection.style.display = 'flex';
        importReleaseDateSection.style.display = 'flex';
        importDocSection.style.display = 'flex';
        
        // 显示查验预警
        if (item.importWarning) {
            document.getElementById('detail_importWarning_display').innerHTML = 
                `<span class="warning-badge warning-${item.importWarning}">${getWarningName(item.importWarning)}</span>`;
            document.getElementById('detail_importWarning_display').style.display = 'inline-block';
            document.getElementById('detail_importWarning').style.display = 'none';
        }
        
        // 显示放行日期
        if (item.importReleaseDate) {
            document.getElementById('detail_importReleaseDate_display').textContent = item.importReleaseDate;
            document.getElementById('detail_importReleaseDate_display').style.display = 'inline-block';
            document.getElementById('detail_importReleaseDate').style.display = 'none';
        }
    } else {
        importWarningSection.style.display = 'none';
        importReleaseDateSection.style.display = 'none';
        importDocSection.style.display = 'none';
    }
    
    // 生成商品列表
    generateDetailProductList(item);
    
    // 显示详情页
    document.getElementById('customsDetailPage').classList.add('show');
    
    // 隐藏保存按钮（查看详情时）
    document.getElementById('saveDetailBtn').style.display = 'none';
}

// 获取预警名称
function getWarningName(warning) {
    const map = { 'red': '红灯', 'yellow': '黄灯', 'green': '绿灯', 'null': 'NULL' };
    return map[warning] || '';
}

// 生成商品列表
function generateDetailProductList(item) {
    const tableBody = document.getElementById('detailProductTableBody');
    tableBody.innerHTML = '';
    
    // 生成5-10条商品数据
    const productCount = 5 + Math.floor(Math.random() * 6);
    
    for (let i = 1; i <= productCount; i++) {
        const canEdit = item.status === 'export-pending' || item.status === 'export-pre';
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${i}</td>
            <td>MKU${2000 + i}</td>
            <td>SKU${1000 + i}</td>
            <td>${Math.random() > 0.3 ? 'CMN' + (3000 + i) : '-'}</td>
            <td>IO${10000 + i}</td>
            <td>PO${20000 + i}</td>
            <td>
                <input type="text" value="商品${i}的货物描述" ${canEdit ? '' : 'disabled'}>
            </td>
            <td>个</td>
            <td>cái</td>
            <td>${(50000 + Math.random() * 100000).toFixed(2)}</td>
            <td>${Math.floor(Math.random() * 100) + 10}</td>
            <td>${Math.random() > 0.5 ? '中国' : '越南'}</td>
            <td>PKG${30000 + i}</td>
            <td>${(10 + Math.random() * 50).toFixed(2)} kg</td>
            <td>29A-${10000 + i}</td>
        `;
        tableBody.appendChild(row);
    }
}

// 关闭详情页
function closeCustomsDetail() {
    document.getElementById('customsDetailPage').classList.remove('show');
    currentCustomsDetail = null;
    currentActionType = '';
    uploadedFiles = { export: [], import: [] };
    
    // 清空文件列表
    document.getElementById('exportFileList').innerHTML = '';
    document.getElementById('importFileList').innerHTML = '';
    
    // 重置表单
    document.getElementById('detail_exportWarning').value = '';
    document.getElementById('detail_importWarning').value = '';
    document.getElementById('detail_exportReleaseDate').value = '';
    document.getElementById('detail_importReleaseDate').value = '';
}

// 处理文件上传
function handleFileUpload(input, type, maxFiles) {
    const files = Array.from(input.files);
    const currentFiles = uploadedFiles[type] || [];
    
    // 检查文件数量
    if (currentFiles.length + files.length > maxFiles) {
        alert(`最多只能上传${maxFiles}个文件`);
        input.value = '';
        return;
    }
    
    // 检查文件大小
    const maxSize = 10 * 1024 * 1024; // 10MB
    for (let file of files) {
        if (file.size > maxSize) {
            alert(`文件"${file.name}"超过10MB限制`);
            input.value = '';
            return;
        }
    }
    
    // 添加文件
    uploadedFiles[type] = [...currentFiles, ...files];
    
    // 显示文件列表
    displayFileList(type);
    
    input.value = '';
}

// 显示文件列表
function displayFileList(type) {
    const listContainer = document.getElementById(type + 'FileList');
    const files = uploadedFiles[type] || [];
    
    listContainer.innerHTML = '';
    
    files.forEach((file, index) => {
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';
        fileItem.innerHTML = `
            <span class="file-name" title="${file.name}">${file.name}</span>
            <span class="file-size">${formatFileSize(file.size)}</span>
            <span class="file-remove" onclick="removeFile('${type}', ${index})">删除</span>
        `;
        listContainer.appendChild(fileItem);
    });
}

// 删除文件
function removeFile(type, index) {
    uploadedFiles[type].splice(index, 1);
    displayFileList(type);
}

// 格式化文件大小
function formatFileSize(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (bytes / Math.pow(k, i)).toFixed(2) + ' ' + sizes[i];
}

// 保存详情
function saveCustomsDetail() {
    if (!currentCustomsDetail) return;
    
    // 根据操作类型进行不同的验证和保存
    if (currentActionType === 'inspection') {
        // 海关查验
        const isExport = currentCustomsDetail.status.startsWith('export');
        const warningSelect = isExport ? 
            document.getElementById('detail_exportWarning') : 
            document.getElementById('detail_importWarning');
        
        if (!warningSelect.value) {
            alert('请选择查验预警');
            return;
        }
        
        alert(`海关查验保存成功！\n批次号：${currentCustomsDetail.batchNo}\n查验预警：${getWarningName(warningSelect.value)}`);
        
    } else if (currentActionType === 'release') {
        // 海关放行
        const isExport = currentCustomsDetail.status.startsWith('export');
        
        if (isExport) {
            const dateInput = document.getElementById('detail_exportReleaseDate');
            if (!dateInput.value) {
                alert('请选择出口放行日期');
                return;
            }
            if (uploadedFiles.export.length === 0) {
                alert('请上传出口报关单');
                return;
            }
        } else {
            const dateInput = document.getElementById('detail_importReleaseDate');
            if (!dateInput.value) {
                alert('请选择进口放行日期');
                return;
            }
            if (uploadedFiles.import.length === 0) {
                alert('请上传进口报关资料（CI/PL/报关单）');
                return;
            }
        }
        
        alert(`海关放行保存成功！\n批次号：${currentCustomsDetail.batchNo}`);
    }
    
    closeCustomsDetail();
}

// 修改海关查验函数，打开详情页并启用编辑
function handleCustomsInspection(id) {
    const item = customsData.find(d => d.id === id);
    if (!item) return;
    
    currentCustomsDetail = item;
    currentActionType = 'inspection';
    
    showCustomsDetail(item);
    
    // 启用对应的查验预警字段
    const isExport = item.status.startsWith('export');
    
    if (isExport) {
        document.getElementById('detail_exportWarning').disabled = false;
        document.getElementById('detail_exportWarning').style.display = 'block';
        document.getElementById('detail_exportWarning_display').style.display = 'none';
    } else {
        document.getElementById('detail_importWarning').disabled = false;
        document.getElementById('detail_importWarning').style.display = 'block';
        document.getElementById('detail_importWarning_display').style.display = 'none';
    }
    
    // 显示保存按钮
    document.getElementById('saveDetailBtn').style.display = 'inline-block';
}

// 修改海关放行函数，打开详情页并启用编辑
function handleCustomsRelease(id) {
    const item = customsData.find(d => d.id === id);
    if (!item) return;
    
    currentCustomsDetail = item;
    currentActionType = 'release';
    
    showCustomsDetail(item);
    
    // 启用对应的放行日期和文件上传
    const isExport = item.status.startsWith('export');
    
    if (isExport) {
        document.getElementById('detail_exportReleaseDate').disabled = false;
        document.getElementById('detail_exportReleaseDate').style.display = 'block';
        document.getElementById('detail_exportReleaseDate_display').style.display = 'none';
        document.getElementById('exportUploadBtn').disabled = false;
    } else {
        document.getElementById('detail_importReleaseDate').disabled = false;
        document.getElementById('detail_importReleaseDate').style.display = 'block';
        document.getElementById('detail_importReleaseDate_display').style.display = 'none';
        document.getElementById('importUploadBtn').disabled = false;
    }
    
    // 显示保存按钮
    document.getElementById('saveDetailBtn').style.display = 'inline-block';
}

// 分页切换
function handlePageChange(action) {
    const totalPages = Math.ceil(totalRecords / pageSize);
    
    if (action === 'prev' && currentPage > 1) {
        currentPage--;
    } else if (action === 'next' && currentPage < totalPages) {
        currentPage++;
    }
    
    renderTable();
}

// 修改每页显示条数
function handlePageSizeChange() {
    pageSize = parseInt(document.getElementById('pageSize').value);
    currentPage = 1;
    renderTable();
}

// 监听页码输入框
document.addEventListener('DOMContentLoaded', function() {
    const pageInput = document.getElementById('currentPage');
    if (pageInput) {
        pageInput.addEventListener('change', function() {
            const newPage = parseInt(this.value);
            const totalPages = Math.ceil(totalRecords / pageSize);
            
            if (newPage >= 1 && newPage <= totalPages) {
                currentPage = newPage;
                renderTable();
            } else {
                this.value = currentPage;
                alert(`请输入1到${totalPages}之间的页码`);
            }
        });
    }
});

// 查看图片
function viewImage(imageUrl) {
    window.open(imageUrl, '_blank');
}

// 关务评估操作
function handleAssessment(id) {
    const item = mockData.find(d => d.id === id);
    if (!item) return;
    
    currentAssessmentItem = item;
    
    // 填充基本信息
    document.getElementById('modal_intlSku').textContent = item.intlSku;
    document.getElementById('modal_intlMku').textContent = item.intlMku;
    document.getElementById('modal_domesticSkuLink').textContent = item.domesticSku;
    document.getElementById('modal_domesticSkuLink').href = item.domesticSkuLink;
    document.getElementById('modal_category').textContent = item.category;
    document.getElementById('modal_productNameCn').textContent = item.productNameCn;
    document.getElementById('modal_productNameVn').textContent = item.productNameVn;
    document.getElementById('modal_brandName').textContent = item.brandName;
    document.getElementById('modal_customerName').textContent = item.customerName;
    
    // 设置评估状态
    const statusSpan = document.getElementById('modal_assessmentStatus');
    statusSpan.textContent = item.assessmentStatusName;
    statusSpan.className = `status-badge status-${item.assessmentStatus}`;
    
    // 填充评估信息
    document.getElementById('modal_hsCode').value = item.hsCode || '';
    document.getElementById('modal_description').value = item.description || '';
    
    // 清除错误提示
    clearErrors();
    
    // 显示弹窗
    document.getElementById('assessmentModal').classList.add('show');
}

// 关闭评估弹窗
function closeAssessmentModal() {
    document.getElementById('assessmentModal').classList.remove('show');
    currentAssessmentItem = null;
    clearErrors();
}

// 清除错误提示
function clearErrors() {
    document.querySelectorAll('.error-msg').forEach(el => {
        el.classList.remove('show');
    });
    document.querySelectorAll('.form-control').forEach(el => {
        el.classList.remove('error');
    });
}

// 提交评估
function submitAssessment() {
    if (!currentAssessmentItem) return;
    
    // 清除之前的错误
    clearErrors();
    
    // 获取表单值
    const hsCode = document.getElementById('modal_hsCode').value.trim();
    const description = document.getElementById('modal_description').value.trim();
    
    // 验证
    let hasError = false;
    
    if (!hsCode) {
        document.getElementById('modal_hsCode').classList.add('error');
        document.getElementById('hsCode_error').textContent = '请输入HSCode';
        document.getElementById('hsCode_error').classList.add('show');
        hasError = true;
    }
    
    if (!description) {
        document.getElementById('modal_description').classList.add('error');
        document.getElementById('description_error').textContent = '请输入货物描述';
        document.getElementById('description_error').classList.add('show');
        hasError = true;
    }
    
    if (hasError) {
        return;
    }
    
    // 提交成功
    alert(`关务评估提交成功！\n商品：${currentAssessmentItem.productNameCn}\nHSCode：${hsCode}\n货物描述：${description}`);
    
    // 更新数据（实际项目中应该调用API）
    currentAssessmentItem.hsCode = hsCode;
    currentAssessmentItem.description = description;
    
    console.log('提交评估数据：', {
        id: currentAssessmentItem.id,
        hsCode,
        description
    });
    
    // 关闭弹窗
    closeAssessmentModal();
    
    // 刷新表格
    renderTable();
}

// 确认评估
function confirmAssessment() {
    if (!currentAssessmentItem) return;
    
    // 清除之前的错误
    clearErrors();
    
    // 获取表单值
    const hsCode = document.getElementById('modal_hsCode').value.trim();
    const description = document.getElementById('modal_description').value.trim();
    
    // 验证
    let hasError = false;
    
    if (!hsCode) {
        document.getElementById('modal_hsCode').classList.add('error');
        document.getElementById('hsCode_error').textContent = '请输入HSCode';
        document.getElementById('hsCode_error').classList.add('show');
        hasError = true;
    }
    
    if (!description) {
        document.getElementById('modal_description').classList.add('error');
        document.getElementById('description_error').textContent = '请输入货物描述';
        document.getElementById('description_error').classList.add('show');
        hasError = true;
    }
    
    if (hasError) {
        return;
    }
    
    // 二次确认
    if (confirm('已确认评估无误？')) {
        // 确认成功
        alert(`关务评估确认成功！\n商品：${currentAssessmentItem.productNameCn}\nHSCode：${hsCode}\n货物描述：${description}`);
        
        // 更新数据（实际项目中应该调用API）
        currentAssessmentItem.hsCode = hsCode;
        currentAssessmentItem.description = description;
        currentAssessmentItem.assessmentStatus = 'completed';
        currentAssessmentItem.assessmentStatusName = '已评估';
        
        console.log('确认评估数据：', {
            id: currentAssessmentItem.id,
            hsCode,
            description,
            status: 'completed'
        });
        
        // 关闭弹窗
        closeAssessmentModal();
        
        // 刷新表格
        renderTable();
    }
}


// 点击弹窗外部关闭
window.onclick = function(event) {
    const modal = document.getElementById('assessmentModal');
    if (event.target === modal) {
        closeAssessmentModal();
    }
}


// 关务确认操作
function handleConfirm(id) {
    const item = mockData.find(d => d.id === id);
    alert(`关务确认功能：对ID为${id}的记录进行关务确认\n商品名称：${item.productNameCn}\n当前状态：${item.assessmentStatusName}`);
    console.log('关务确认数据：', item);
}

// 详情操作
function handleView(id) {
    const item = mockData.find(d => d.id === id);
    alert(`详情功能：查看ID为${id}的详细信息\n商品名称：${item.productNameCn}\n关务评估状态：${item.assessmentStatusName}`);
    console.log('查看详情数据：', item);
}

// 删除操作
function handleDelete(id) {
    if (confirm('确定要删除这条记录吗？')) {
        const item = mockData.find(d => d.id === id);
        alert(`删除功能：删除ID为${id}的记录\n商品名称：${item.productNameCn}`);
        console.log('删除数据：', item);
        
        // 这里可以实现实际的删除逻辑
        // mockData = mockData.filter(d => d.id !== id);
        // filteredData = filteredData.filter(d => d.id !== id);
        // totalRecords = filteredData.length;
        // renderTable();
    }
}
