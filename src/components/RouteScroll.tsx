import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Scroll behaviour for client-side navigation.
 *
 * The browser only restores scroll position on real page loads, so without this
 * a visitor who clicks a project halfway down the homepage lands halfway down
 * the project page. It also makes homepage anchors (/#work) work when they are
 * followed from another route, where there is no element to jump to on arrival.
 */
const RouteScroll = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const target = document.querySelector(hash);
      if (target) {
        // Offset for the fixed navbar, matching the previous scroll behaviour.
        const top =
          target.getBoundingClientRect().top +
          (window.pageYOffset || document.documentElement.scrollTop) -
          100;
        window.scrollTo({ top, behavior: "smooth" });
        return;
      }
    }
    window.scrollTo({ top: 0 });
  }, [pathname, hash]);

  return null;
};

export default RouteScroll;
