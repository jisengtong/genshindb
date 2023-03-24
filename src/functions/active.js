export default function active(docTitle,elementId) {
    document.title = docTitle + " | Genshin Impact Database"
    document.querySelectorAll('.navlink').forEach(x => {
        x.classList.add('opacity-40');
        document.getElementById(elementId).classList.remove('opacity-40')
    })
}