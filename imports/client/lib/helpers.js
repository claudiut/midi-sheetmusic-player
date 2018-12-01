// https://stackoverflow.com/a/22119674/587594
export const findAncestor = (el, cls) => {
    if (el.classList.contains(cls)) {
        return el;
    }

    while ((el = el.parentElement) && !el.classList.contains(cls));

    return el;
};
