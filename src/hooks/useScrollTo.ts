const useScrollTo = () => {
  const scrollTo = (href: string, offset = 80) => {
    const id = href.replace("#", "");
    const el = document.getElementById(id);
    if (!el) return;

    const top = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: "smooth" });
  };

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string, cb?: () => void) => {
    if (!href.startsWith("#")) return;
    e.preventDefault();
    scrollTo(href);
    cb?.();
  };

  return { handleClick, scrollTo };
};

export default useScrollTo;
