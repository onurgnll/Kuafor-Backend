const formatDate = (date) => {
    const formatingDate = new Date(date);

    // Gün, ay, yıl, saat ve dakika değerlerini al
    const day = String(formatingDate.getDate()).padStart(2, '0');
    const month = String(formatingDate.getMonth() + 1).padStart(2, '0'); // Aylar 0-11 arasında olduğu için +1
    const year = formatingDate.getFullYear();
    const hours = String(formatingDate.getHours()).padStart(2, '0');
    const minutes = String(formatingDate.getMinutes()).padStart(2, '0');

    // Formatı birleştir
    return `${day}/${month}/${year} ${hours}:${minutes}`;
};

const newDate = (date) => {
    if(date) {
        const retDate = new Date(date)
        retDate.setHours(retDate.getHours() + 3)
        return retDate
    }else{
        const retDate = new Date()
        retDate.setHours(retDate.getHours() + 3)
        return retDate

    }
}

module.exports = {
    formatDate,
    newDate
}