/**
 * Matnni slug formatiga o'tkazish
 * "Hello World!" -> "hello-world"
 * @param {string} text
 * @returns {string}
 */
const slugify = text => {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-') // bo'sh joylarni - ga almashtirish
        .replace(/[^\w\-]+/g, '') // maxsus belgilarni olib tashlash
        .replace(/\-\-+/g, '-') // ketma-ket - larni bitta - ga
        .replace(/^-+/, '') // boshidagi - ni olib tashlash
        .replace(/-+$/, '') // oxiridagi - ni olib tashlash
}

module.exports = slugify
