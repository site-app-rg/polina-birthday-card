export type AlbumPhoto = { id: string; src: string; alt: string; position?: string }
export const mediaPath = (filename: string) => `${import.meta.env.BASE_URL}media/${filename}`
// Фотографии Полины в альбоме, коллажах, слайдере и просмотре: для снимков с техническими краями подключены отдельные копии без полос и остатков рамок; оригиналы и фото обложки сохранены.
const cleanedPhotoIds = new Set(['10', '12', '13', '14', '15', '16', '18', '21', '22'])
export const albumPhotos: AlbumPhoto[] = Array.from({ length: 23 }, (_, index) => { const id = String(index + 1).padStart(2, '0'); const suffix = cleanedPhotoIds.has(id) ? '-clean' : ''; return { id, src: mediaPath(`polina-${id}${suffix}.jpg`), alt: `Фотография Полины ${index + 1}` } })
// Порядок снимков в разделах Полины: четыре детских фото остаются на двух перелистываемых страницах, два коллажа и ручной слайдер получают утверждённые подборки.
const orderedPhotos = (ids: string[]) => ids.map((id) => albumPhotos.find((item) => item.id === id)!)
export const childhoodPhotos = orderedPhotos(['13', '19', '11', '14'])
export const firstCollagePhotos = orderedPhotos(['20', '21', '01', '03'])
export const secondCollagePhotos = orderedPhotos(['23', '17', '15', '18', '08'])
// Снимок 04 перенесён к письму; слайдер Полины начинается с фото 22 и содержит восемь снимков без дублей.
export const sliderPhotos = orderedPhotos(['22', '02', '05', '06', '07', '09', '10', '12'])
export const surprisePhoto = albumPhotos[22]
// Копии из оригиналов с итоговым уровнем 72% звучат тише и в Safari iPhone, где громкость аудиоэлемента может не регулироваться. Исходные песни Полины сохранены.
export const introSong = mediaPath('birthday-intro-72.mp3')
export const mainSong = mediaPath('birthday-background-72.mp3')
// Утверждённый текст письма Полины: переносы внутри вступления и заключения сохранены; неразрывные пробелы удерживают эмодзи рядом с предшествующими словами.
export const letterParagraphs = [
'Дорогая моя!\u00a0❤️\nХочу поздравить тебя с днём рождения!\u00a0🎉',
'Пожелать тебе хочется много и ещё больше. Счастья громадного, успехов всевозможных, любви бездонной.',
'Чтобы в твоём доме царили покой и уют, а ты всегда находила желание и силы их поддерживать и создавать. Чтобы несчастья и горести всегда обходили тебя стороной.',
'А ты была почаще весела и беспечна, твой задорный, искристый смех звучал как можно чаще.\u00a0🥰',
'Достатка тебе желаю огромного. Пусть без труда решаются проблемы. Да просто чтобы жизнь была без них.',
'Очень тебя люблю!\u00a0❤️\nСпасибо за твою дружбу и поддержку!',
'Ещё раз с днём рождения тебя!\u00a0💋🎂'
]
