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
let currentCustomsStatus = 'all'; // 当前选中的报关状态，默认为全部
let currentCustomsDetail = null; // 当前查看详情的报关单
let currentActionType = ''; // 当前操作类型
let uploadedFiles = { exportDraft: [], export: [], CI: [], PL: [], DN: [], VAT: [] }; // 已上传的文件

// 初始化页面
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOMContentLoaded event fired');
    
    // 默认展开第一个菜单
    const firstMenu = document.querySelector('.menu-item');
    if (firstMenu) {
        firstMenu.classList.add('active');
    }
    
    console.log('About to generate mock data');
    // 生成模拟数据
    generateMockData();
    console.log('Mock data generated');
    
    // 渲染表格
    renderTable();
    console.log('Table rendered');
    
    console.log('About to generate customs data');
    // 生成报关管理模拟数据
    try {
        generateCustomsData();
        console.log('generateCustomsData completed successfully');
    } catch (error) {
        console.error('Error generating customs data:', error);
    }
    
    console.log('Initialization complete');
    // 不需要立即渲染报关表格，因为页面默认不可见
    // renderCustomsTable();
});

// 生成模拟数据
function generateMockData() {
    const statuses = ['pending', 'confirming', 'completed'];
    const statusNames = ['待评估', '待确认', '已评估'];
    const productTypes = ['china', 'vietnam'];
    const productTypeNames = ['中国', '越南'];
    const customers = ['客户A', '客户B', '客户C', '客户D', '客户E'];
    const brands = ['品牌A', '品牌B', '品牌C', '品牌D', '品牌E'];
    const categories = ['电子产品', '日用品', '服装', '食品', '化妆品'];
    const productStatus = ['上架', '下架'];
    const creators = ['lizimeng16', 'wangwu23', 'zhaoliu18', 'zhangsan15', 'lisi20'];
    
    mockData = [];
    
    for (let i = 1; i <= 100; i++) {
        const statusIndex = Math.floor(Math.random() * statuses.length);
        const typeIndex = Math.floor(Math.random() * productTypes.length);
        const hasCustomerOrder = Math.random() > 0.5;
        const hasCustomerMaterialNo = Math.random() > 0.3;
        
        // 生成客户物料号，支持多个来源
        let customerMaterialNo = '';
        if (hasCustomerMaterialNo) {
            const sources = ['wimp', '开阳'];
            const materialCount = Math.random() > 0.7 ? 2 : 1; // 30%概率有两个料号
            const materials = [];
            for (let j = 0; j < materialCount; j++) {
                const source = sources[Math.floor(Math.random() * sources.length)];
                materials.push(`CMN${3000 + i + j}（${source}）`);
            }
            customerMaterialNo = materials.join('；');
        }
        
        const createTime = new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1);
        const updateTime = new Date(createTime.getTime() + Math.random() * 30 * 24 * 60 * 60 * 1000);
        
        mockData.push({
            id: i,
            intlSku: `SKU${1000 + i}`,
            intlMku: `MKU${2000 + i}`,
            domesticSku: `DSKU${4000 + i}`,
            domesticSkuLink: `https://www.example.com/product/${4000 + i}`,
            customerMaterialNo: customerMaterialNo,
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
        console.log('loadPage: switching to customs page');
        console.log('customsData.length:', customsData.length);
        console.log('customsFilteredData.length:', customsFilteredData.length);
        console.log('currentCustomsStatus:', currentCustomsStatus);
        
        // 确保使用当前状态重新过滤和渲染
        filterCustomsDataByStatus(currentCustomsStatus);
        renderCustomsTable();
        updateCustomsStatusBadges();
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
        tableBody.innerHTML = '<tr><td colspan="23" style="text-align: center; padding: 40px; color: #999;">暂无数据</td></tr>';
        return;
    }
    
    pageData.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.intlSku}</td>
            <td>${item.intlMku}</td>
            <td>${item.customerMaterialNo || '-'}</td>
            <td>${item.customerName}</td>
            <td title="${item.productNameCn}">${item.productNameCn}</td>
            <td><input type="text" class="editable-input" value="${item.hsCode}" onblur="updateHsCode(${item.id}, this.value)" style="width: 100%; padding: 4px; border: 1px solid #d9d9d9; border-radius: 3px;"></td>
            <td title="${item.productNameVn}">${item.productNameVn}</td>
            <td><img src="${item.productImage}" alt="商品图片" class="product-image" onclick="viewImage('${item.productImage}')"></td>
            <td>${item.unitCn}</td>
            <td>${item.unitVn}</td>
            <td><input type="text" class="editable-input" value="${item.description}" onblur="updateDescription(${item.id}, this.value)" style="width: 100%; padding: 4px; border: 1px solid #d9d9d9; border-radius: 3px;"></td>
            <td><span class="type-badge type-${item.productType}">${item.productTypeName}</span></td>
            <td>${item.erpSystem}</td>
            <td style="min-width: 160px;">${item.createTime}</td>
            <td><span class="status-badge status-${item.assessmentStatus}">${item.assessmentStatusName}</span></td>
            <td>${item.hasCustomerOrder ? '是' : '否'}</td>
            <td title="${item.brandName}">${item.brandName}</td>
            <td title="${item.category}">${item.category}</td>
            <td>${item.productStatus}</td>
            <td><input type="text" class="editable-input" value="${item.remark || ''}" onblur="updateRemark(${item.id}, this.value)" placeholder="请输入备注" style="width: 100%; padding: 4px; border: 1px solid #d9d9d9; border-radius: 3px;"></td>
            <td>${item.creator}</td>
            <td title="${item.updater}">${item.updater}</td>
            <td style="min-width: 160px;">${item.updateTime}</td>
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
    
    // 如果全选复选框不存在（已被移除），直接返回
    if (!checkAll) {
        return;
    }
    
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
    document.getElementById('selectedCount').innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 2L4 7v10l8 5 8-5V7l-8-5z"/>
            <circle cx="12" cy="12" r="3"/>
        </svg>
        <strong>${checkedCount}</strong>
    `;
    updateCheckAllState();
}

// 更新HSCode
function updateHsCode(id, newValue) {
    const item = mockData.find(d => d.id === id);
    if (!item) return;
    
    const oldValue = item.hsCode;
    if (oldValue === newValue) return;
    
    item.hsCode = newValue;
    console.log(`更新HSCode: ID=${id}, 旧值="${oldValue}", 新值="${newValue}"`);
    
    // 实际应用中应该调用API保存
    // saveHsCode(id, newValue);
}

// 更新货品描述
function updateDescription(id, newValue) {
    const item = mockData.find(d => d.id === id);
    if (!item) return;
    
    const oldValue = item.description;
    if (oldValue === newValue) return;
    
    item.description = newValue;
    console.log(`更新货品描述: ID=${id}, 旧值="${oldValue}", 新值="${newValue}"`);
    
    // 实际应用中应该调用API保存
    // saveDescription(id, newValue);
}

// 更新备注
function updateRemark(id, newValue) {
    const item = mockData.find(d => d.id === id);
    if (!item) return;
    
    const oldValue = item.remark || '';
    if (oldValue === newValue) return;
    
    item.remark = newValue;
    console.log(`更新备注: ID=${id}, 旧值="${oldValue}", 新值="${newValue}"`);
    
    // 实际应用中应该调用API保存
    // saveRemark(id, newValue);
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
    console.log('generateCustomsData: Function called');
    
    // 出口阶段的状态
    const exportStatuses = ['export-pre', 'export-pending', 'export-declaring', 'export-inspecting', 'export-released'];
    const exportStatusNames = ['出口预报关', '出口待报关', '出口报关中', '出口查验中', '出口已放行'];
    
    // 进口阶段的状态（仅在出口已放行后才会进入进口阶段）
    const importStatuses = ['import-declaring', 'import-inspecting', 'import-released'];
    const importStatusNames = ['进口报关中', '进口查验中', '进口已放行'];
    
    const warnings = ['red', 'yellow', 'green', 'null'];
    const warningNames = ['红灯', '黄灯', '绿灯', 'NULL'];
    const invoiceStatuses = ['not-invoiced', 'data-error', 'partial-draft', 'partial-formal', 'draft-invoiced', 'formal-invoiced'];
    const invoiceStatusNames = ['未开票', '开票数据错误', '部分草稿票', '部分正式票', '已开草稿票', '已开正式票'];
    const updaters = ['lizimeng16', 'wangwu23', 'zhaoliu18', 'zhangsan15', 'lisi20'];
    const exportCountries = ['china', 'vietnam'];
    const exportCountryNames = ['中国', '越南'];
    
    customsData = [];
    
    console.log('generateCustomsData: Starting to generate 100 records');
    
    for (let i = 1; i <= 100; i++) {
        const createTime = new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1);
        const updateTime = new Date(createTime.getTime() + Math.random() * 30 * 24 * 60 * 60 * 1000);
        
        // 70%的数据是出口阶段，30%的数据是进口阶段
        const isImportPhase = Math.random() > 0.7;
        
        let status, statusName, exportReleaseDate = '', importReleaseDate = '';
        
        if (isImportPhase) {
            // 进口阶段：必然已经出口放行
            const importStatusIndex = Math.floor(Math.random() * importStatuses.length);
            status = importStatuses[importStatusIndex];
            statusName = importStatusNames[importStatusIndex];
            
            // 进口阶段必须有出口放行日期
            const exportDate = new Date(updateTime.getTime() - Math.random() * 10 * 24 * 60 * 60 * 1000);
            exportReleaseDate = formatDate(exportDate);
            
            // 如果是进口已放行，还需要有进口放行日期
            if (status === 'import-released') {
                importReleaseDate = formatDate(updateTime);
            }
        } else {
            // 出口阶段
            const exportStatusIndex = Math.floor(Math.random() * exportStatuses.length);
            status = exportStatuses[exportStatusIndex];
            statusName = exportStatusNames[exportStatusIndex];
            
            // 只有出口已放行状态才有出口放行日期
            if (status === 'export-released') {
                exportReleaseDate = formatDate(updateTime);
            }
        }
        
        const isExport = status.startsWith('export');
        const warningIndex = Math.floor(Math.random() * warnings.length);
        const vatInvoiceStatusIndex = Math.floor(Math.random() * invoiceStatuses.length);
        const dnInvoiceStatusIndex = Math.floor(Math.random() * invoiceStatuses.length);
        const exportCountryIndex = Math.floor(Math.random() * exportCountries.length);
        
        customsData.push({
            id: i,
            batchNo: `BATCH${2024}${String(i).padStart(4, '0')}`,
            customerCode: `CUST${String(Math.floor(Math.random() * 5) + 1).padStart(3, '0')}`,
            status: status,
            statusName: statusName,
            vatInvoiceStatus: invoiceStatuses[vatInvoiceStatusIndex],
            vatInvoiceStatusName: invoiceStatusNames[vatInvoiceStatusIndex],
            dnInvoiceStatus: invoiceStatuses[dnInvoiceStatusIndex],
            dnInvoiceStatusName: invoiceStatusNames[dnInvoiceStatusIndex],
            warning: warnings[warningIndex],
            warningName: warningNames[warningIndex],
            exportWarning: isExport && Math.random() > 0.3 ? warnings[warningIndex] : '',
            importWarning: !isExport && Math.random() > 0.3 ? warnings[warningIndex] : '',
            exportReleaseDate: exportReleaseDate,
            importReleaseDate: importReleaseDate,
            exportCountry: exportCountries[exportCountryIndex],
            exportCountryName: exportCountryNames[exportCountryIndex],
            updater: updaters[Math.floor(Math.random() * updaters.length)],
            updateTime: formatDateTime(updateTime)
        });
    }
    
    console.log('generateCustomsData: Generated', customsData.length, 'records');
    
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
    
    // 重置搜索条件并重新渲染
    handleCustomsReset();
    
    // 确保渲染表格
    filterCustomsDataByStatus(status);
    renderCustomsTable();
}

// 根据状态过滤数据
function filterCustomsDataByStatus(status) {
    console.log('filterCustomsDataByStatus called with status:', status);
    console.log('customsData length before filter:', customsData.length);
    
    if (status === 'all') {
        // 全部状态，显示所有数据
        customsFilteredData = [...customsData];
    } else if (status === 'export-waiting') {
        // 出口等待中：出口已放行的数据
        customsFilteredData = customsData.filter(item => item.status === 'export-released');
    } else if (status === 'export-released') {
        // 出口已放行TAB：只显示已进入进口阶段的数据（import-*状态），不显示进口等待中的数据
        customsFilteredData = customsData.filter(item => item.status.startsWith('import-'));
    } else if (status === 'import-waiting') {
        // 进口等待中：出口非已放行的数据（待报关、报关中、海关查验中）
        customsFilteredData = customsData.filter(item => 
            item.status === 'export-pending' || 
            item.status === 'export-declaring' || 
            item.status === 'export-inspecting'
        );
    } else {
        // 按指定状态过滤
        customsFilteredData = customsData.filter(item => item.status === status);
    }
    customsTotalRecords = customsFilteredData.length;
    customsCurrentPage = 1;
    
    console.log('customsFilteredData length after filter:', customsFilteredData.length);
    console.log('customsTotalRecords:', customsTotalRecords);
}

// 更新状态徽标数字
function updateCustomsStatusBadges() {
    const statuses = ['export-pending', 'export-declaring', 'export-inspecting', 'export-released', 
                     'import-declaring', 'import-inspecting', 'import-released'];
    
    // 更新全部TAB的徽标
    const allBadge = document.getElementById('badge-all');
    if (allBadge) {
        allBadge.textContent = customsData.length;
    }
    
    // 更新出口等待中的徽标（等于出口已放行的数量）
    const exportWaitingBadge = document.getElementById('badge-export-waiting');
    if (exportWaitingBadge) {
        const waitingCount = customsData.filter(item => item.status === 'export-released').length;
        exportWaitingBadge.textContent = waitingCount;
    }
    
    // 更新进口等待中的徽标（等于出口非已放行的数量：待报关+报关中+海关查验中）
    const importWaitingBadge = document.getElementById('badge-import-waiting');
    if (importWaitingBadge) {
        const waitingCount = customsData.filter(item => 
            item.status === 'export-pending' || 
            item.status === 'export-declaring' || 
            item.status === 'export-inspecting'
        ).length;
        importWaitingBadge.textContent = waitingCount;
    }
    
    // 更新各状态TAB的徽标
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
    
    console.log('renderCustomsTable called');
    console.log('customsData length:', customsData.length);
    console.log('customsFilteredData length:', customsFilteredData.length);
    console.log('currentCustomsStatus:', currentCustomsStatus);
    
    // 如果表格不存在（页面未加载），直接返回
    if (!tableBody) {
        console.log('tableBody not found');
        return;
    }
    
    const start = (customsCurrentPage - 1) * customsPageSize;
    const end = start + customsPageSize;
    const pageData = customsFilteredData.slice(start, end);
    
    console.log('pageData length:', pageData.length);
    
    tableBody.innerHTML = '';
    
    if (pageData.length === 0) {
        console.log('No data to display');
        tableBody.innerHTML = '<tr><td colspan="13" style="text-align: center; padding: 40px; color: #999;">暂无数据</td></tr>';
        return;
    }
    
    pageData.forEach(item => {
        const row = document.createElement('tr');
        
        // 获取出口和进口状态文本
        const exportStatusText = getExportStatusText(item);
        const importStatusText = getImportStatusText(item);
        
        row.innerHTML = `
            <td><input type="checkbox" class="customs-row-checkbox" value="${item.id}" data-status="${item.status}" onchange="updateCustomsSelectedCount()"></td>
            <td>${item.batchNo}</td>
            <td>${exportStatusText}</td>
            <td>${importStatusText}</td>
            <td><span class="invoice-badge invoice-${item.vatInvoiceStatus}">${item.vatInvoiceStatusName}</span></td>
            <td><span class="invoice-badge invoice-${item.dnInvoiceStatus}">${item.dnInvoiceStatusName}</span></td>
            <td><span class="warning-badge warning-${item.exportWarning}">${getWarningName(item.exportWarning)}</span></td>
            <td><span class="warning-badge warning-${item.importWarning}">${getWarningName(item.importWarning)}</span></td>
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
    
    // 更新全选复选框状态
    updateCustomsCheckAllState();
    // 更新选中计数
    updateCustomsSelectedCount();
    
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

// 获取出口报关状态文本
function getExportStatusText(item) {
    const statusMap = {
        'export-pre': '预报关',
        'export-pending': '待报关',
        'export-declaring': '报关中',
        'export-inspecting': '查验中',
        'export-released': '已放行'
    };
    
    if (item.status.startsWith('export-')) {
        return statusMap[item.status] || '-';
    } else if (item.status.startsWith('import-')) {
        // 进口阶段，出口状态为已放行
        return '已放行';
    }
    return '-';
}

// 获取进口报关状态文本
function getImportStatusText(item) {
    const statusMap = {
        'import-declaring': '待报关',
        'import-inspecting': '查验中',
        'import-released': '已放行'
    };
    
    if (item.status.startsWith('import-')) {
        return statusMap[item.status] || '-';
    } else if (item.status === 'export-released') {
        // 出口已放行，进口为等待中
        return '等待中';
    }
    return '-';
}

// 根据报关状态生成操作按钮
function getCustomsActionButtons(item) {
    let buttons = '';
    
    // 特殊处理：如果当前在出口已放行TAB，只显示导出资料和详情按钮
    if (currentCustomsStatus === 'export-released') {
        buttons = `
            <div class="action-btns">
                <div class="action-btn-row">
                    <button class="action-btn" onclick="exportCustomsMaterialDetail(${item.id})">导出资料</button>
                    <button class="action-btn" onclick="handleCustomsDetail(${item.id})">详情</button>
                </div>
            </div>
        `;
        return buttons;
    }
    
    // 特殊处理：如果当前在进口等待中TAB,只显示导出资料和详情按钮
    if (currentCustomsStatus === 'import-waiting') {
        buttons = `
            <div class="action-btns">
                <div class="action-btn-row">
                    <button class="action-btn" onclick="exportCustomsMaterialDetail(${item.id})">导出资料</button>
                    <button class="action-btn" onclick="handleCustomsDetail(${item.id})">详情</button>
                </div>
            </div>
        `;
        return buttons;
    }
    
    switch(item.status) {
        case 'export-pre':
            // 出口预报关：导出资料、详情
            buttons = `
                <div class="action-btns">
                    <div class="action-btn-row">
                        <button class="action-btn" onclick="exportCustomsMaterialDetail(${item.id})">导出资料</button>
                        <button class="action-btn" onclick="handleCustomsDetail(${item.id})">详情</button>
                    </div>
                </div>
            `;
            break;
        case 'export-pending':
            // 出口待报关：确认报关、导出资料、详情
            buttons = `
                <div class="action-btns">
                    <div class="action-btn-row">
                        <button class="action-btn" onclick="handleConfirmDeclaration(${item.id})">确认报关</button>
                        <button class="action-btn" onclick="exportCustomsMaterialDetail(${item.id})">导出资料</button>
                    </div>
                    <div class="action-btn-row">
                        <button class="action-btn" onclick="handleCustomsDetail(${item.id})">详情</button>
                    </div>
                </div>
            `;
            break;
        case 'export-declaring':
            // 出口报关中：取消确认、海关查验、海关放行、导出资料、详情
            buttons = `
                <div class="action-btns">
                    <div class="action-btn-row">
                        <button class="action-btn" onclick="handleCancelConfirm(${item.id})">取消确认</button>
                        <button class="action-btn" onclick="handleCustomsInspection(${item.id})">海关查验</button>
                    </div>
                    <div class="action-btn-row">
                        <button class="action-btn" onclick="handleCustomsRelease(${item.id})">海关放行</button>
                        <button class="action-btn" onclick="exportCustomsMaterialDetail(${item.id})">导出资料</button>
                    </div>
                    <div class="action-btn-row">
                        <button class="action-btn" onclick="handleCustomsDetail(${item.id})">详情</button>
                    </div>
                </div>
            `;
            break;
        case 'export-inspecting':
            // 出口查验中：取消确认、海关放行、导出资料、详情
            buttons = `
                <div class="action-btns">
                    <div class="action-btn-row">
                        <button class="action-btn" onclick="handleCancelConfirm(${item.id})">取消确认</button>
                        <button class="action-btn" onclick="handleCustomsRelease(${item.id})">海关放行</button>
                    </div>
                    <div class="action-btn-row">
                        <button class="action-btn" onclick="exportCustomsMaterialDetail(${item.id})">导出资料</button>
                        <button class="action-btn" onclick="handleCustomsDetail(${item.id})">详情</button>
                    </div>
                </div>
            `;
            break;
        case 'export-released':
            // 出口已放行/进口等待中：导出资料、详情
            buttons = `
                <div class="action-btns">
                    <div class="action-btn-row">
                        <button class="action-btn" onclick="exportCustomsMaterialDetail(${item.id})">导出资料</button>
                        <button class="action-btn" onclick="handleCustomsDetail(${item.id})">详情</button>
                    </div>
                </div>
            `;
            break;
        case 'import-declaring':
            // 进口报关中：取消确认、海关查验、海关放行、导出资料、详情
            buttons = `
                <div class="action-btns">
                    <div class="action-btn-row">
                        <button class="action-btn" onclick="handleCancelConfirm(${item.id})">取消确认</button>
                        <button class="action-btn" onclick="handleCustomsInspection(${item.id})">海关查验</button>
                    </div>
                    <div class="action-btn-row">
                        <button class="action-btn" onclick="handleCustomsRelease(${item.id})">海关放行</button>
                        <button class="action-btn" onclick="exportCustomsMaterialDetail(${item.id})">导出资料</button>
                    </div>
                    <div class="action-btn-row">
                        <button class="action-btn" onclick="handleCustomsDetail(${item.id})">详情</button>
                    </div>
                </div>
            `;
            break;
        case 'import-inspecting':
            // 进口查验中：取消确认、海关放行、导出资料、详情
            buttons = `
                <div class="action-btns">
                    <div class="action-btn-row">
                        <button class="action-btn" onclick="handleCancelConfirm(${item.id})">取消确认</button>
                        <button class="action-btn" onclick="handleCustomsRelease(${item.id})">海关放行</button>
                    </div>
                    <div class="action-btn-row">
                        <button class="action-btn" onclick="exportCustomsMaterialDetail(${item.id})">导出资料</button>
                        <button class="action-btn" onclick="handleCustomsDetail(${item.id})">详情</button>
                    </div>
                </div>
            `;
            break;
        case 'import-released':
            // 进口已放行：导出资料、详情
            buttons = `
                <div class="action-btns">
                    <div class="action-btn-row">
                        <button class="action-btn" onclick="exportCustomsMaterialDetail(${item.id})">导出资料</button>
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
    const exportWarning = document.getElementById('customs_exportInspectionWarning').value;
    const importWarning = document.getElementById('customs_importInspectionWarning').value;
    
    // 先根据状态过滤
    customsFilteredData = customsData.filter(item => item.status === currentCustomsStatus);
    
    // 再根据搜索条件过滤
    if (batchNo) {
        customsFilteredData = customsFilteredData.filter(item => item.batchNo.includes(batchNo));
    }
    
    if (customerCode) {
        customsFilteredData = customsFilteredData.filter(item => item.customerCode.includes(customerCode));
    }
    
    if (exportWarning) {
        customsFilteredData = customsFilteredData.filter(item => item.exportWarning === exportWarning);
    }
    
    if (importWarning) {
        customsFilteredData = customsFilteredData.filter(item => item.importWarning === importWarning);
    }
    
    customsTotalRecords = customsFilteredData.length;
    customsCurrentPage = 1;
    renderCustomsTable();
}

// 报关重置
function handleCustomsReset() {
    document.getElementById('customs_batchNo').value = '';
    document.getElementById('customs_customerCode').value = '';
    document.getElementById('customs_exportInspectionWarning').value = '';
    document.getElementById('customs_importInspectionWarning').value = '';
    
    filterCustomsDataByStatus(currentCustomsStatus);
    renderCustomsTable();
}

// 报关导出
function handleCustomsExport() {
    const statusText = currentCustomsStatus === 'all' ? '全部' : (customsFilteredData[0]?.statusName || '');
    alert(`导出功能：将导出当前${statusText}状态的所有数据\n共 ${customsFilteredData.length} 条记录`);
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
    if (!item) return;
    
    currentCustomsDetail = item;
    currentActionType = 'confirmDeclaration';
    
    showCustomsDetail(item);
    
    // 启用草稿资料上传
    document.getElementById('exportDraftUploadBtn').disabled = false;
    
    // 给报关草单标签加红色星号表示必填
    const exportDraftLabel = document.getElementById('exportDraftLabel');
    if (exportDraftLabel && !exportDraftLabel.innerHTML.includes('*')) {
        exportDraftLabel.innerHTML = '报关草单：<span style="color: red;">*</span>';
    }
    
    // 显示保存按钮并改名为"确认报关"
    const saveBtn = document.getElementById('saveDetailBtn');
    saveBtn.textContent = '确认报关';
    saveBtn.style.display = 'inline-block';
}

// 取消确认
function handleCancelConfirm(id) {
    const item = customsData.find(d => d.id === id);
    if (confirm(`确认取消批次号 ${item.batchNo} 的确认操作？`)) {
        alert(`取消确认成功！\n批次号：${item.batchNo}`);
        console.log('取消确认：', item);
    }
}

// 进口报关
function handleImportDeclaration(id) {
    const item = customsData.find(d => d.id === id);
    
    // 验证是否已有出口放行日期
    if (!item.exportReleaseDate) {
        alert(`进口报关前，必须先完成出口海关放行！\n批次号：${item.batchNo}\n当前状态：${item.statusName}\n\n请先完成出口海关放行操作，填写出口放行日期后，才能进行进口报关。`);
        return;
    }
    
    if (confirm(`确认对批次号 ${item.batchNo} 进行进口报关？\n出口放行日期：${item.exportReleaseDate}`)) {
        alert(`进口报关成功！\n批次号：${item.batchNo}\n状态已变更为：进口报关中`);
        console.log('进口报关：', item);
        // 实际项目中应该调用API更新状态
        // item.status = 'import-declaring';
        // item.statusName = '进口报关中';
        // renderCustomsTable();
    }
}

// 取消进口确认
function handleCancelImportConfirm(id) {
    const item = customsData.find(d => d.id === id);
    if (confirm(`确认取消批次号 ${item.batchNo} 的进口确认操作？\n将回退至出口已放行状态`)) {
        alert(`取消进口确认成功！\n批次号：${item.batchNo}\n状态已回退至：出口已放行`);
        console.log('取消进口确认：', item);
        // 实际项目中应该调用API更新状态
        // item.status = 'export-released';
        // item.statusName = '出口已放行';
        // renderCustomsTable();
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
        
        // 给出口查验预警标签加红色星号表示必填
        const exportWarningLabel = document.getElementById('exportWarningLabel');
        if (exportWarningLabel && !exportWarningLabel.innerHTML.includes('*')) {
            exportWarningLabel.innerHTML = '出口查验预警：<span style="color: red;">*</span>';
        }
    } else {
        document.getElementById('detail_importWarning').disabled = false;
        document.getElementById('detail_importWarning').style.display = 'block';
        document.getElementById('detail_importWarning_display').style.display = 'none';
        
        // 给进口查验预警标签加红色星号表示必填
        const importWarningLabel = document.getElementById('importWarningLabel');
        if (importWarningLabel && !importWarningLabel.innerHTML.includes('*')) {
            importWarningLabel.innerHTML = '进口查验预警：<span style="color: red;">*</span>';
        }
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
    
    // 启用对应的放行日期
    const isExport = item.status.startsWith('export');
    
    if (isExport) {
        document.getElementById('detail_exportReleaseDate').disabled = false;
        document.getElementById('detail_exportReleaseDate').style.display = 'block';
        document.getElementById('detail_exportReleaseDate_display').style.display = 'none';
        
        // 给出口放行日期标签加红色星号表示必填
        const exportReleaseDateLabel = document.getElementById('exportReleaseDateLabel');
        if (exportReleaseDateLabel && !exportReleaseDateLabel.innerHTML.includes('*')) {
            exportReleaseDateLabel.innerHTML = '出口放行日期：<span style="color: red;">*</span>';
        }
    } else {
        document.getElementById('detail_importReleaseDate').disabled = false;
        document.getElementById('detail_importReleaseDate').style.display = 'block';
        document.getElementById('detail_importReleaseDate_display').style.display = 'none';
        
        // 给进口放行日期标签加红色星号表示必填
        const importReleaseDateLabel = document.getElementById('importReleaseDateLabel');
        if (importReleaseDateLabel && !importReleaseDateLabel.innerHTML.includes('*')) {
            importReleaseDateLabel.innerHTML = '进口放行日期：<span style="color: red;">*</span>';
        }
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

// 导出单条报关资料
function exportCustomsMaterialDetail(id) {
    const item = customsData.find(d => d.id === id);
    if (!item) {
        alert('未找到该报关单信息');
        return;
    }
    
    console.log('导出资料：', item);
    alert(`正在导出批次号 ${item.batchNo} 的报关资料\n\n包括：\n- CI（商业发票）\n- PL（装箱单）\n- DN（交货单）\n- VAT（增值税发票）\n\n请稍候...`);
    
    // 实际项目中，这里应该调用后端API下载文件
    // 例如：window.open(`/api/customs/export-materials/${id}`, '_blank');
}

// 显示报关单详情
function showCustomsDetail(item) {
    // 填充基本信息
    document.getElementById('detail_batchNo').textContent = item.batchNo;
    
    const statusSpan = document.getElementById('detail_status');
    statusSpan.textContent = item.statusName;
    statusSpan.className = 'status-badge';
    
    // 【详情】页展示所有进出口信息，默认都显示且不可编辑
    // 出口相关字段 - 始终显示
    const exportDraftDocSection = document.getElementById('exportDraftDocSection');
    const exportWarningSection = document.getElementById('exportWarningSection');
    const exportReleaseDateSection = document.getElementById('exportReleaseDateSection');
    const exportDocSection = document.getElementById('exportDocSection');
    
    exportDraftDocSection.style.display = 'flex';
    exportWarningSection.style.display = 'flex';
    exportReleaseDateSection.style.display = 'flex';
    exportDocSection.style.display = 'flex';
    
    // 重置所有字段为禁用状态
    document.getElementById('exportDraftUploadBtn').disabled = true;
    document.getElementById('detail_exportWarning').disabled = true;
    document.getElementById('detail_exportWarning').style.display = 'none';
    document.getElementById('detail_exportReleaseDate').disabled = true;
    document.getElementById('detail_exportReleaseDate').style.display = 'none';
    
    // 显示出口查验预警
    if (item.exportWarning) {
        document.getElementById('detail_exportWarning_display').innerHTML = 
            `<span class="warning-badge warning-${item.exportWarning}">${getWarningName(item.exportWarning)}</span>`;
        document.getElementById('detail_exportWarning_display').style.display = 'inline-block';
    } else {
        document.getElementById('detail_exportWarning_display').textContent = '-';
        document.getElementById('detail_exportWarning_display').style.display = 'inline-block';
    }
    
    // 显示出口放行日期
    if (item.exportReleaseDate) {
        document.getElementById('detail_exportReleaseDate_display').textContent = item.exportReleaseDate;
    } else {
        document.getElementById('detail_exportReleaseDate_display').textContent = '-';
    }
    document.getElementById('detail_exportReleaseDate_display').style.display = 'inline-block';
    
    // 进口相关字段 - 始终显示
    const importWarningSection = document.getElementById('importWarningSection');
    const importReleaseDateSection = document.getElementById('importReleaseDateSection');
    
    importWarningSection.style.display = 'flex';
    importReleaseDateSection.style.display = 'flex';
    
    // 重置进口字段为禁用状态
    document.getElementById('detail_importWarning').disabled = true;
    document.getElementById('detail_importWarning').style.display = 'none';
    document.getElementById('detail_importReleaseDate').disabled = true;
    document.getElementById('detail_importReleaseDate').style.display = 'none';
    
    // 显示进口查验预警
    if (item.importWarning) {
        document.getElementById('detail_importWarning_display').innerHTML = 
            `<span class="warning-badge warning-${item.importWarning}">${getWarningName(item.importWarning)}</span>`;
        document.getElementById('detail_importWarning_display').style.display = 'inline-block';
    } else {
        document.getElementById('detail_importWarning_display').textContent = '-';
        document.getElementById('detail_importWarning_display').style.display = 'inline-block';
    }
    
    // 显示进口放行日期
    if (item.importReleaseDate) {
        document.getElementById('detail_importReleaseDate_display').textContent = item.importReleaseDate;
    } else {
        document.getElementById('detail_importReleaseDate_display').textContent = '-';
    }
    document.getElementById('detail_importReleaseDate_display').style.display = 'inline-block';
    
    // 显示DN开票状态
    const dnInvoiceSection = document.getElementById('dnInvoiceSection');
    dnInvoiceSection.style.display = 'flex';
    if (item.dnInvoiceStatus && item.dnInvoiceStatusName) {
        document.getElementById('detail_dnInvoiceStatus').innerHTML = 
            `<span class="invoice-badge invoice-${item.dnInvoiceStatus}">${item.dnInvoiceStatusName}</span>`;
    } else {
        document.getElementById('detail_dnInvoiceStatus').textContent = '-';
    }
    
    // 显示VAT开票状态
    const vatInvoiceSection = document.getElementById('vatInvoiceSection');
    vatInvoiceSection.style.display = 'flex';
    if (item.vatInvoiceStatus && item.vatInvoiceStatusName) {
        document.getElementById('detail_vatInvoiceStatus').innerHTML = 
            `<span class="invoice-badge invoice-${item.vatInvoiceStatus}">${item.vatInvoiceStatusName}</span>`;
    } else {
        document.getElementById('detail_vatInvoiceStatus').textContent = '-';
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
    const orderPersons = ['张三', '李四', '王五', '赵六', '钱七'];
    const sources = ['wimp', '开阳'];
    
    for (let i = 1; i <= productCount; i++) {
        const canEdit = item.status === 'export-pending' || item.status === 'export-pre';
        const grossWeight = (10 + Math.random() * 50).toFixed(2);
        const netWeight = (grossWeight * 0.8).toFixed(2);
        
        // 生成客户物料号，只有一个，不带数据来源
        let customerMaterialNo = '-';
        if (Math.random() > 0.3) {
            customerMaterialNo = `CMN${3000 + i}`;
        }
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${i}</td>
            <td>MKU${2000 + i}</td>
            <td>SKU${1000 + i}</td>
            <td>${customerMaterialNo}</td>
            <td>IO${10000 + i}</td>
            <td>PO${20000 + i}</td>
            <td>
                <input type="text" value="商品${i}的货物描述" ${canEdit ? '' : 'disabled'}>
            </td>
            <td>个</td>
            <td>cái</td>
            <td>${(50000 + Math.random() * 100000).toFixed(2)}</td>
            <td>${Math.floor(Math.random() * 100) + 10}</td>
            <td>${netWeight}</td>
            <td>${Math.random() > 0.5 ? '中国' : '越南'}</td>
            <td>PKG${30000 + i}</td>
            <td>${grossWeight}</td>
            <td>${orderPersons[Math.floor(Math.random() * orderPersons.length)]}</td>
        `;
        tableBody.appendChild(row);
    }
}

// 下载文件
function downloadFile(fileType) {
    if (!currentCustomsDetail) {
        alert('无详情信息');
        return;
    }
    
    // 模拟文件下载
    const fileName = `${currentCustomsDetail.batchNo}_${fileType}.xlsx`;
    alert(`正在下载文件: ${fileName}\n\n实际应用中,这里会触发真实的文件下载。`);
    console.log(`下载文件: ${fileType}`, {
        batchNo: currentCustomsDetail.batchNo,
        fileType: fileType,
        fileName: fileName
    });
    
    // 实际应用中，这里应该是:
    // window.open(`/api/download/${currentCustomsDetail.id}/${fileType}`, '_blank');
    // 或者使用fetch下载并保存文件
}

// 关闭详情页
function closeCustomsDetail() {
    document.getElementById('customsDetailPage').classList.remove('show');
    currentCustomsDetail = null;
    currentActionType = '';
    uploadedFiles = { exportDraft: [], export: [], CI: [], PL: [], DN: [], VAT: [] };
    
    // 清空文件列表
    document.getElementById('exportDraftFileList').innerHTML = '';
    document.getElementById('exportFileList').innerHTML = '';
    document.getElementById('ciFileList').innerHTML = '';
    document.getElementById('plFileList').innerHTML = '';
    document.getElementById('dnFileList').innerHTML = '';
    document.getElementById('vatFileList').innerHTML = '';
    
    // 重置表单
    document.getElementById('detail_exportWarning').value = '';
    document.getElementById('detail_importWarning').value = '';
    document.getElementById('detail_exportReleaseDate').value = '';
    document.getElementById('detail_importReleaseDate').value = '';
    
    // 恢复所有标签（去除红色星号）
    const exportDraftLabel = document.getElementById('exportDraftLabel');
    if (exportDraftLabel) {
        exportDraftLabel.innerHTML = '报关草单：';
    }
    
    const exportWarningLabel = document.getElementById('exportWarningLabel');
    if (exportWarningLabel) {
        exportWarningLabel.innerHTML = '出口查验预警：';
    }
    
    const importWarningLabel = document.getElementById('importWarningLabel');
    if (importWarningLabel) {
        importWarningLabel.innerHTML = '进口查验预警：';
    }
    
    const exportReleaseDateLabel = document.getElementById('exportReleaseDateLabel');
    if (exportReleaseDateLabel) {
        exportReleaseDateLabel.innerHTML = '出口放行日期：';
    }
    
    const importReleaseDateLabel = document.getElementById('importReleaseDateLabel');
    if (importReleaseDateLabel) {
        importReleaseDateLabel.innerHTML = '进口放行日期：';
    }
    
    // 恢复保存按钮文字
    const saveBtn = document.getElementById('saveDetailBtn');
    if (saveBtn) {
        saveBtn.textContent = '保存';
    }
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
            <span class="file-download" onclick="downloadFile('${type}', ${index})" title="下载">下载</span>
            <span class="file-remove" onclick="removeFile('${type}', ${index})">删除</span>
        `;
        listContainer.appendChild(fileItem);
    });
}

// 处理材料文件上传 (CI/PL/DN/VAT)
function handleMaterialFileUpload(input, type, maxFiles) {
    const files = Array.from(input.files);
    const currentFiles = uploadedFiles[type] || [];
    
    // 检查文件数量
    if (currentFiles.length + files.length > maxFiles) {
        alert(`${type}最多只能上传${maxFiles}个文件`);
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
    displayMaterialFileList(type);
    
    input.value = '';
}

// 显示材料文件列表
function displayMaterialFileList(type) {
    const listContainer = document.getElementById(type.toLowerCase() + 'FileList');
    const files = uploadedFiles[type] || [];
    
    listContainer.innerHTML = '';
    
    files.forEach((file, index) => {
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item-mini';
        fileItem.innerHTML = `
            <span class="file-name" title="${file.name}">${file.name}</span>
            <span class="file-remove" onclick="removeMaterialFile('${type}', ${index})">×</span>
        `;
        listContainer.appendChild(fileItem);
    });
}

// 删除材料文件
function removeMaterialFile(type, index) {
    uploadedFiles[type].splice(index, 1);
    displayMaterialFileList(type);
}

// 删除文件
function removeFile(type, index) {
    uploadedFiles[type].splice(index, 1);
    displayFileList(type);
}

// 下载文件
function downloadFile(type, index) {
    const file = uploadedFiles[type][index];
    if (!file) return;
    
    // 创建下载链接
    const url = URL.createObjectURL(file);
    const link = document.createElement('a');
    link.href = url;
    link.download = file.name;
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // 释放URL对象
    setTimeout(() => URL.revokeObjectURL(url), 100);
    
    console.log(`下载文件: ${file.name}`);
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
    if (currentActionType === 'confirmDeclaration') {
        // 出口【确认报关】：出口报关资料（草稿资料）必填
        if (uploadedFiles.exportDraft.length === 0) {
            alert('请上传出口报关资料（草稿资料）\n请上传报关草单');
            return;
        }
        
        alert(`确认报关成功！\n批次号：${currentCustomsDetail.batchNo}\n已上传草稿资料：${uploadedFiles.exportDraft.length}个文件`);
        
    } else if (currentActionType === 'inspection') {
        // 海关查验：查验预警必填
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
        // 海关放行：放行日期必填
        const isExport = currentCustomsDetail.status.startsWith('export');
        
        if (isExport) {
            // 出口海关放行：出口放行日期必填
            const dateInput = document.getElementById('detail_exportReleaseDate');
            if (!dateInput.value) {
                alert('请选择出口放行日期');
                return;
            }
            alert(`出口海关放行保存成功！\n批次号：${currentCustomsDetail.batchNo}\n出口放行日期：${dateInput.value}`);
        } else {
            // 进口海关放行：必须先有出口放行日期，且进口放行日期必填
            const exportReleaseDate = currentCustomsDetail.exportReleaseDate;
            if (!exportReleaseDate) {
                alert('进口海关放行前，必须先完成出口海关放行！\n请确保该批次已有出口放行日期。');
                return;
            }
            
            const dateInput = document.getElementById('detail_importReleaseDate');
            if (!dateInput.value) {
                alert('请选择进口放行日期');
                return;
            }
            
            // 验证进口放行日期不能早于出口放行日期
            if (dateInput.value < exportReleaseDate) {
                alert(`进口放行日期不能早于出口放行日期！\n出口放行日期：${exportReleaseDate}\n请重新选择进口放行日期。`);
                return;
            }
            
            alert(`进口海关放行保存成功！\n批次号：${currentCustomsDetail.batchNo}\n进口放行日期：${dateInput.value}`);
        }
    }
    
    closeCustomsDetail();
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

// ==================== 报关单列表选择框相关功能 ====================

// 全选/取消全选报关单
function toggleCustomsCheckAll(checkbox) {
    // 单选模式下禁用全选功能
    checkbox.checked = false;
    return;
}

// 更新报关单全选复选框状态
function updateCustomsCheckAllState() {
    const checkboxes = document.querySelectorAll('.customs-row-checkbox');
    const checkAll = document.getElementById('customsCheckAll');
    
    if (!checkAll || checkboxes.length === 0) {
        if (checkAll) {
            checkAll.checked = false;
            checkAll.indeterminate = false;
        }
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

// 更新报关单选中计数
function updateCustomsSelectedCount() {
    const checkboxes = document.querySelectorAll('.customs-row-checkbox');
    const checkedBoxes = Array.from(checkboxes).filter(cb => cb.checked);
    
    // 实现单选：如果选中多个,只保留最后一个
    if (checkedBoxes.length > 1) {
        // 取消之前所有选中的,只保留当前点击的
        const lastChecked = checkedBoxes[checkedBoxes.length - 1];
        checkedBoxes.forEach(cb => {
            if (cb !== lastChecked) {
                cb.checked = false;
            }
        });
    }
    
    updateCustomsCheckAllState();
    
    // 【导出资料】按钮始终显示
    const exportMaterialBtn = document.getElementById('exportMaterialBtn');
    if (exportMaterialBtn) {
        exportMaterialBtn.style.display = 'inline-block';
    }
}

// 获取报关单选中的项目ID
function getCustomsSelectedIds() {
    const checkboxes = document.querySelectorAll('.customs-row-checkbox:checked');
    return Array.from(checkboxes).map(cb => parseInt(cb.value));
}

// 获取报关单选中的项目数据
function getCustomsSelectedItems() {
    const ids = getCustomsSelectedIds();
    return customsData.filter(item => ids.includes(item.id));
}

// 导出资料
function handleExportMaterial() {
    const selectedIds = getCustomsSelectedIds();
    if (selectedIds.length === 0) {
        alert('请选择一条数据进行导出资料');
        return;
    }
    
    const selectedItems = getCustomsSelectedItems();
    
    // 显示批次信息
    const batchNos = selectedItems.map(item => item.batchNo).join('、');
    document.getElementById('exportBatchInfo').textContent = batchNos;
    
    // 重置复选框为默认全选
    document.getElementById('export_ci').checked = true;
    document.getElementById('export_pl').checked = true;
    document.getElementById('export_dn').checked = true;
    document.getElementById('export_vat').checked = true;
    
    // 显示弹窗
    document.getElementById('exportMaterialModal').classList.add('show');
}

// 关闭导出资料弹窗
function closeExportMaterialModal() {
    document.getElementById('exportMaterialModal').classList.remove('show');
}

// 确认导出资料
function confirmExportMaterial() {
    const selectedItems = getCustomsSelectedItems();
    
    // 获取选中的导出项
    const exportCI = document.getElementById('export_ci').checked;
    const exportPL = document.getElementById('export_pl').checked;
    const exportDN = document.getElementById('export_dn').checked;
    const exportVAT = document.getElementById('export_vat').checked;
    
    const exportList = [];
    if (exportCI) exportList.push('CI');
    if (exportPL) exportList.push('PL');
    if (exportDN) exportList.push('DN');
    if (exportVAT) exportList.push('VAT');
    
    if (exportList.length === 0) {
        alert('请至少选择一项导出明细');
        return;
    }
    
    // 验证开票状态
    let hasError = false;
    const errorMessages = [];
    
    selectedItems.forEach(item => {
        // 检查DN开票状态
        if (exportDN && item.dnInvoiceStatus === 'not-invoiced') {
            errorMessages.push(`批次${item.batchNo}：DN未开票，导出失败！`);
            hasError = true;
        }
        
        // 检查VAT开票状态
        if (exportVAT && item.vatInvoiceStatus === 'not-invoiced') {
            errorMessages.push(`批次${item.batchNo}：VAT未开票，导出失败！`);
            hasError = true;
        }
    });
    
    // 如果有错误，显示错误信息
    if (hasError) {
        alert(errorMessages.join('\n'));
        // 注意：不影响其他文件的导出，这里可以继续导出CI和PL
    }
    
    // 执行导出（包括成功的项）
    const successItems = selectedItems.filter(item => {
        let canExport = true;
        if (exportDN && item.dnInvoiceStatus === 'not-invoiced') canExport = false;
        if (exportVAT && item.vatInvoiceStatus === 'not-invoiced') canExport = false;
        return canExport;
    });
    
    if (successItems.length > 0 || exportList.some(item => item === 'CI' || item === 'PL')) {
        const successBatchNos = successItems.map(item => item.batchNo).join('、');
        alert(`导出资料成功！\n批次：${successBatchNos || '部分批次'}\n导出明细：${exportList.join('、')}\n\n${hasError ? '部分批次因开票状态问题导出失败，请查看上一条提示。' : ''}`);
        console.log('导出资料：', {
            items: successItems,
            exportList: exportList
        });
    }
    
    // 关闭弹窗
    closeExportMaterialModal();
}

// 点击弹窗外部关闭导出资料弹窗
window.addEventListener('click', function(event) {
    const exportModal = document.getElementById('exportMaterialModal');
    if (event.target === exportModal) {
        closeExportMaterialModal();
    }
});
