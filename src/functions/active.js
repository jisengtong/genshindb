export default function active(docTitle,param) {
    document.title = docTitle + " | Genshin Impact Database"
    document.querySelectorAll('.navlink').forEach(x => {
        x.classList.add('opacity-40');
        document.getElementById(param).classList.remove('opacity-40')
    })
}