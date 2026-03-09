// جلب العناصر الأساسية
let productName = document.getElementById('productName');
let price = document.getElementById('price');
let discount = document.getElementById('discount');
let count = document.getElementById('count');
let total = document.getElementById('total');
let submit = document.getElementById('submit');
let tbody = document.getElementById('tbody');
let deleteAllBtnContainer = document.getElementById('deleteAllBtnContainer');

let mood = 'create'; // وضع الإنشاء أو التعديل
let temp; // لتخزين فهرس العنصر عند التعديل

// المصفوفة لتخزين البيانات
let dataPro = localStorage.product ? JSON.parse(localStorage.product) : [];

// دالة حساب الإجمالي وعرضه مباشرة
function getTotal(){
    let p = parseFloat(price.value) || 0;
    let d = parseFloat(discount.value) || 0;
    let c = parseInt(count.value) || 1;

    if(p < 0) p = 0;
    if(d < 0) d = 0;
    if(c < 1) c = 1;

    let subtotal = p - d;
    if(subtotal < 0) subtotal = 0;

    let totalValue = subtotal * c;

    total.innerHTML = totalValue.toFixed(2);
    total.style.backgroundColor = '#28a745';
}

// استدعاء getTotal عند كتابة السعر أو الخصم أو الكمية
price.onkeyup = getTotal;
discount.onkeyup = getTotal;
count.onkeyup = getTotal;

// دالة إضافة أو تعديل المنتج
submit.onclick = function(){
    let p = parseFloat(price.value) || 0;
    let d = parseFloat(discount.value) || 0;
    let c = parseInt(count.value) || 1;

    if(p < 0) p = 0;
    if(d < 0) d = 0;
    if(c < 1) c = 1;

    let subtotal = p - d;
    if(subtotal < 0) subtotal = 0;
    let totalValue = subtotal * c;

    let newPro = {
        productName: productName.value,
        price: p.toFixed(2),
        discount: d.toFixed(2),
        count: c,
        total: totalValue.toFixed(2)
    };

    // التحقق من صحة البيانات
    if(productName.value != '' && p > 0 && c > 0){
        if(mood === 'create'){
            dataPro.push(newPro);
        } else {
            dataPro[temp] = newPro;
            mood = 'create';
            submit.innerHTML = 'إضافة المنتج';
        }
        clearData();
    } else {
        alert("الرجاء إدخال اسم السلعة والسعر والكمية بشكل صحيح");
    }

    localStorage.setItem('product', JSON.stringify(dataPro));
    showData();
}

// مسح الحقول
function clearData(){
    productName.value = '';
    price.value = '';
    discount.value = '';
    count.value = '1';
    total.innerHTML = '';
    total.style.backgroundColor = '#dc3545';
}

// عرض البيانات
function showData(){
    getTotal();
    let table = '';
    for(let i=0; i<dataPro.length; i++){
        table += `
        <tr>
            <td data-label="ID">${i+1}</td>
            <td data-label="اسم السلعة">${dataPro[i].productName}</td>
            <td data-label="السعر">${dataPro[i].price}</td>
            <td data-label="الخصم">${dataPro[i].discount}</td>
            <td data-label="العدد">${dataPro[i].count}</td>
            <td data-label="الحساب">${dataPro[i].total}</td>
            <td><button onclick="updateData(${i})" class="table-button update">تعديل</button></td>
            <td><button onclick="deleteData(${i})" class="table-button delete">حذف</button></td>
        </tr>`;
    }

    tbody.innerHTML = table;

    if(dataPro.length > 0){
        deleteAllBtnContainer.innerHTML = `<button onclick="deleteAll()">حذف الكل (${dataPro.length})</button>`;
    } else {
        deleteAllBtnContainer.innerHTML = '';
    }
}

showData();

// حذف عنصر واحد
function deleteData(i){
    dataPro.splice(i, 1);
    localStorage.setItem('product', JSON.stringify(dataPro));
    showData();
}

// حذف الكل
function deleteAll(){
    if(confirm('هل أنت متأكد من حذف جميع المنتجات؟')){
        dataPro = [];
        localStorage.removeItem('product');
        showData();
    }
}

// تعديل عنصر
function updateData(i){
    productName.value = dataPro[i].productName;
    price.value = dataPro[i].price;
    discount.value = dataPro[i].discount;
    count.value = dataPro[i].count;

    getTotal();
    submit.innerHTML = 'تعديل المنتج';
    mood = 'update';
    temp = i;
    window.scroll({top:0, behavior:'smooth'});
}

// البحث مع تمييز النص
function searchData(value){
    let table = '';
    for(let i=0; i<dataPro.length; i++){
        if(dataPro[i].productName.toLowerCase().includes(value.toLowerCase())){
            table += `
            <tr>
                <td data-label="ID">${i+1}</td>
                <td data-label="اسم السلعة">${dataPro[i].productName.replace(new RegExp(value,'gi'), match=>`<mark>${match}</mark>`)}</td>
                <td data-label="السعر">${dataPro[i].price}</td>
                <td data-label="الخصم">${dataPro[i].discount}</td>
                <td data-label="العدد">${dataPro[i].count}</td>
                <td data-label="الحساب">${dataPro[i].total}</td>
                <td><button onclick="updateData(${i})" class="table-button update">تعديل</button></td>
                <td><button onclick="deleteData(${i})" class="table-button delete">حذف</button></td>
            </tr>`;
        }
    }
    tbody.innerHTML = table;
}