// جلب العناصر الأساسية من HTML
let productName = document.getElementById('productName');
let price = document.getElementById('price');
let discount = document.getElementById('discount');
let count = document.getElementById('count'); // الآن يمثل حقل الكمية
let total = document.getElementById('total');
let submit = document.getElementById('submit');
let tbody = document.getElementById('tbody');
let deleteAllBtnContainer = document.getElementById('deleteAllBtnContainer');
let mood = 'create'; // لتحديد وضع الزر (إنشاء/تعديل)
let temp; // لتخزين ID العنصر المراد تعديله مؤقتاً

// 1. *تخزين البيانات في مصفوفة (Array) واسترجاعها من localStorage*
let dataPro;
if (localStorage.product != null) {
    dataPro = JSON.parse(localStorage.product);
} else {
    dataPro = [];
}

// 2. *دالة حساب الإجمالي (Total)*
function getTotal() {
    // التأكد من أن حقل السعر ليس فارغاً
    if (price.value != '') {
        // التحقق من أن القيمة ليست بالسالب
        let p = Math.max(0, parseFloat(price.value));
        let d = Math.max(0, parseFloat(discount.value) || 0);
        let c = Math.max(1, parseInt(count.value) || 1); // الكمية لا تقل عن 1

        // الحساب الإجمالي: (السعر - الخصم) * الكمية
        let subtotal = p - d;
        if (subtotal < 0) {
            subtotal = 0;
        }

        let result = subtotal * c;
        
        total.innerHTML = result.toFixed(2); // عرض النتيجة
        total.style.backgroundColor = '#28a745';
    } else {
        total.innerHTML = '';
        total.style.backgroundColor = '#dc3545'; // لون أحمر عند عدم وجود سعر
    }
}

// *إضافة دالة getTotal لحساب الكمية عند تغيير العدد*
count.onkeyup = getTotal;


// 3. *دالة إنشاء/تعديل المنتج (Submit)*
submit.onclick = function() {
    let newPro = {
        productName: productName.value,
        price: price.value,
        discount: discount.value || 0,
        count: count.value, // حفظ الكمية كخاصية
        total: total.innerHTML,
    };

    // *التحقق من صحة البيانات الأساسية*
    if (productName.value != '' && price.value != '' && parseInt(newPro.count) > 0 && newPro.total != '') {

        // *وضع الإنشاء (Create Mood)*
        if (mood === 'create') {
            // يتم إضافة منتج واحد فقط بغض النظر عن الكمية
            dataPro.push(newPro);
        } 
        
        // *وضع التعديل (Update Mood)*
        else {
            // تحديث العنصر في المصفوفة بناءً على الفهرس المخزن في temp
            dataPro[temp] = newPro;
            mood = 'create'; // إعادة الوضع إلى إنشاء
            submit.innerHTML = 'إضافة المنتج'; // إعادة نص الزر
        }

        clearData(); // مسح حقول الإدخال
        
    } else {
        // رسالة تنبيه بسيطة في حالة نقص البيانات
        alert("الرجاء إدخال اسم السلعة والسعر (قيمة موجبة) والكمية (لا تقل عن 1)");
    }


    // *حفظ البيانات في localStorage*
    localStorage.setItem('product', JSON.stringify(dataPro));
    
    showData(); // عرض البيانات المحدثة
};


// 4. *دالة مسح حقول الإدخال (Clear Inputs)*
function clearData() {
    productName.value = '';
    price.value = '';
    discount.value = '';
    count.value = '1';
    total.innerHTML = '';
    total.style.backgroundColor = '#dc3545';
}


// 5. *دالة قراءة وعرض البيانات (Show Data)*
function showData() {
    getTotal(); // إعادة حساب التوتال عند العرض (للتأكد)

    let table = '';
    for (let i = 0; i < dataPro.length; i++) {
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
            </tr>
        `;
    }

    tbody.innerHTML = table;
    
    // *إنشاء زر حذف الكل (Delete All Button)*
    if (dataPro.length > 0) {
        deleteAllBtnContainer.innerHTML = `
            <button onclick="deleteAll()">حذف الكل (${dataPro.length})</button>
        `;
    } else {
        deleteAllBtnContainer.innerHTML = '';
    }
}

// استدعاء دالة العرض عند تحميل الصفحة لأول مرة
showData();

// 6. *دالة حذف عنصر واحد (Delete Single Item)*
function deleteData(i) {
    dataPro.splice(i, 1); // حذف عنصر واحد من المصفوفة في الفهرس المحدد
    localStorage.product = JSON.stringify(dataPro); // تحديث localStorage
    showData(); // إعادة عرض البيانات المحدثة
}

// 7. *دالة حذف الكل (Delete All)*
function deleteAll() {
    if(confirm('هل أنت متأكد من حذف جميع المنتجات؟ هذا الإجراء لا يمكن التراجع عنه.')){
        localStorage.clear(); // مسح جميع البيانات في localStorage (لمفتاح 'product' فقط)
        dataPro.splice(0); // تفريغ المصفوفة
        showData(); // إعادة عرض البيانات
    }
}

// 8. *دالة التعديل (Update)*
function updateData(i) {
    productName.value = dataPro[i].productName;
    price.value = dataPro[i].price;
    discount.value = dataPro[i].discount;
    count.value = dataPro[i].count;
    
    getTotal(); // حساب الإجمالي للعنصر الذي تم تحميله

    submit.innerHTML = 'تعديل المنتج'; // تغيير نص الزر
    mood = 'update'; // تغيير الوضع
    temp = i; // حفظ الفهرس/ID مؤقتاً
    
    // *تم إزالة إخفاء حقل العدد هنا لكي يتمكن المستخدم من تعديل الكمية*

    scroll({
        top: 0,
        behavior: 'smooth'
    }); // الصعود لأعلى الصفحة لتسهيل التعديل
}


// 9. *دالة البحث (Search)*
function searchData(value) {
    let table = '';
    // المرور على جميع المنتجات والبحث عن القيمة المدخلة
    for (let i = 0; i < dataPro.length; i++) {
        // البحث باستخدام اسم السلعة
        if (dataPro[i].productName.toLowerCase().includes(value.toLowerCase())) {
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
                </tr>
            `;
        }
    }
    tbody.innerHTML = table; // عرض نتائج البحث
}