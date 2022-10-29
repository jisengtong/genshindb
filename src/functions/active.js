export default function active(param) {
    document.querySelectorAll('.navlink').forEach(x => {
        x.classList.add('opacity-40');
        document.getElementById(param).classList.remove('opacity-40')
    })
}