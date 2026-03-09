// عناصر HTML
let productName = document.getElementById('productName');
let price = document.getElementById('price');
let discount = document.getElementById('discount');
let count = document.getElementById('count');
let total = document.getElementById('total');
let submit = document.getElementById('submit');
let tbody = document.getElementById('tbody');
let deleteAllBtnContainer = document.getElementById('deleteAllBtnContainer');

let mood = 'create';
let temp;

// المصفوفة لتخزين المنتجات
let dataPro = localStorage.product ? JSON.parse(localStorage.product) : [];

// دالة حساب الإجمالي
function getTotal(){
    if(price.value != ''){
        let p = Math.max(0, parseFloat(price.value));
        let d = Math.max(0, parseFloat(discount.value)||0);
        let c = Math.max(1, parseInt(count.value)||1);

        let subtotal = p-d;
        if(subtotal<0) subtotal=0;

        total.innerHTML = (subtotal*c).toFixed(2);
        total.style.backgroundColor = '#28a745';
    } else {
        total.innerHTML='';
        total.style.backgroundColor='#dc3545';
    }
}

// إضافة/تعديل
submit.onclick = function(){
    let newPro = {
        productName: productName.value,
        price: price.value,
        discount: discount.value || 0,
        count: count.value,
        total: total.innerHTML
    };

    if(productName.value != '' && price.value != '' && parseInt(newPro.count)>0 && newPro.total != ''){
        if(mood === 'create'){
            dataPro.push(newPro);
        } else {
            dataPro[temp] = newPro;
            mood = 'create';
            submit.innerHTML='إضافة المنتج';
        }

        clearData();
    } else {
        alert("الرجاء إدخال اسم السلعة والسعر والكمية الصحيحة");
    }

    localStorage.setItem('product', JSON.stringify(dataPro));
    showData();
}

// مسح الحقول
function clearData(){
    productName.value='';
    price.value='';
    discount.value='';
    count.value='1';
    total.innerHTML='';
    total.style.backgroundColor='#dc3545';
}

// عرض البيانات
function showData(){
    getTotal();
    let table='';
    for(let i=0;i<dataPro.length;i++){
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

    if(dataPro.length>0){
        deleteAllBtnContainer.innerHTML = `<button onclick="deleteAll()">حذف الكل (${dataPro.length})</button>`;
    } else {
        deleteAllBtnContainer.innerHTML='';
    }
}

showData();

// حذف عنصر واحد
function deleteData(i){
    dataPro.splice(i,1);
    localStorage.setItem('product', JSON.stringify(dataPro));
    showData();
}

// حذف الكل
function deleteAll(){
    if(confirm('هل أنت متأكد من حذف جميع المنتجات؟')){
        localStorage.removeItem('product');
        dataPro=[];
        showData();
    }
}

// تعديل عنصر
function updateData(i){
    productName.value=dataPro[i].productName;
    price.value=dataPro[i].price;
    discount.value=dataPro[i].discount;
    count.value=dataPro[i].count;
    getTotal();
    submit.innerHTML='تعديل المنتج';
    mood='update';
    temp=i;
    window.scroll({top:0, behavior:'smooth'});
}

// البحث مع Highlight
function searchData(value){
    let table='';
    for(let i=0;i<dataPro.length;i++){
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