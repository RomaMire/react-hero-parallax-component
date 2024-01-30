import { useEffect, useRef, useState, useContext } from "react";
import useSectionObserver from "../../hooks/use-sectionObserver";
import { ScrollSpy } from "../../store/ScrollSpyProvider";
import style from "./hero.module.scss";

const Hero = (props) => {
	const [position, setPosition] = useState(0);
	const ScrollSpyCtx = useContext(ScrollSpy);

	const { header, idx } = props;

	const headerRef = useRef();

	const { active: activeSection } = useSectionObserver(headerRef, 0);

	const [curr, setCurr] = useState(0);
	const [scroll, setScroll] = useState(0);

	const imgRef = useRef();

	useEffect(() => {
		setCurr(activeSection);

		ScrollSpyCtx.checkCurrent(+curr, true);
		const checkScroll = () => {
			setScroll(window.scrollY);
		};
		window.addEventListener("scroll", checkScroll);

		return () => {
			window.removeEventListener("scroll", checkScroll);
		};
	}, [activeSection, curr, scroll]);

	useEffect(() => {
		const handleParalax = () => {
			let offset = window.scrollY;
			setPosition(offset);

			let param = offset * 0.25;

			imgRef.current.style.transform = `translateY(${param}px)`;
			imgRef.current.style.transform += `scale(${1 + param * 0.001})`;
		};

		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						window.addEventListener("scroll", handleParalax);
					}
				});
			},
			{
				rootMargin: "100px",
			}
		);

		observer.observe(imgRef.current);

		return () => {
			setTimeout(() => {
				window.removeEventListener("scroll", handleParalax);
				observer.unobserve(imgRef.current);
			}, 200);

			clearTimeout();
		};
	}, [position]);

	return (
		<header className={style.hero__container} data-number={idx} ref={headerRef}>
			<div className={style.hero__img} ref={imgRef}></div>

			<div className={style.hero__heading}>
				<h1>{header}</h1>

				{props.children}
			</div>
		</header>
	);
};

export default Hero;
