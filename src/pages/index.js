import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { Text, TrackballControls } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState } from "react";
import ONLY from "../../public/only.mp3";
import BUNNY from "../../public/bunny.png";
import Image from "next/image";
import LETTER from "../../public/Letter.png";
import Head from "next/head";

function Word({ children, ...props }) {
    const color = new THREE.Color();
    const fontProps = {
        font: "/Inter-Bold.woff",
        fontSize: 1,
        letterSpacing: -0.05,
        lineHeight: 1,
        "material-toneMapped": false,
    };
    const ref = useRef();
    const [hovered, setHovered] = useState(false);
    const over = (e) => (e.stopPropagation(), setHovered(true));
    const out = () => setHovered(false);

    // Change the mouse cursor on hover
    useEffect(() => {
        if (hovered) document.body.style.cursor = "pointer";
        return () => (document.body.style.cursor = "auto");
    }, [hovered]);

    // Tie component to the render-loop
    useFrame(({ camera }) => {
        // Make text face the camera
        ref.current.quaternion.copy(camera.quaternion);

        // Animate font color
        ref.current.material.color.lerp(color.set(hovered ? "#fa2720" : "white"), 0.1);
    });
    return (
        <Text
            ref={ref}
            onPointerOver={over}
            onPointerOut={out}
            onClick={() => console.log("clicked")}
            {...props}
            {...fontProps}
            // eslint-disable-next-line react/no-children-prop
            children={children}
        />
    );
}

function Cloud({ count = 4, radius = 20 }) {
    const wordList = [
        "I get lost inside \na moment with you, \nit’s unfair",
        "Such a crazy thing \nhow you have the answers \nwithout knowing",
        "You’re the one for life \nbut you don’t even\n know it yet",
        "There’s just something \nwonderful when everything \nfalls into place",
        "I see it \nin the little things \nthat you’re doing\n so beautifully clueless",
        "How you’re so unaware\nOf what you do\nTo me",
        "Don't worry, \n'cause babe\nyou got me, and I\nI'm stayin' right here",
        "And though the season's change\nMy love will stay the same",
        "You're the only \nconstant thing in my world",
        "Our love will stand\n the test of time\n'Cause baby, \nyou're my constant",
        "I'm always coming back\nTo the one I call home",
        'Think I only want \none number in my phone\nI might change your contact to\n"don\'t leave me alone"',
        "I don't want no one else\nBaby, I'm in too deep",
        "I'll be honest\nLookin' at you got me thinkin' nonsense",
        "I caught the L-O-V-E\nHow do you do this to me?",
        "Don't be shy, you decide\nSay, can I make you mine?",
        "Your skin so fine\nCome close, baby, put it on mine",
        "We can take the long way\nWe'll get there \neven if it takes all night",
        "If you love me, \nwon't you say so\nGirl, won't you say so",
        "And I snuck in \nthrough the garden gate\nEvery night that summer\n just to seal my fate",
        "And I screamed \nfor whatever it's worth,\nI love you, \nain't that the worst thing\n you ever heard?",
        "We could take our time and\nGet to know each other\n over cherry wine",
        "In the midst of the crowds\nIn the shapes in the clouds\nI don't see nobody but you",
        "In my rose-tinted dreams\nWrinkled silk on my sheets\nI don't see nobody but you",
        "Tell me\nDo you feel the love?",
        "Spend a summer or a lifetime with me\nLet me take you \nto the place of your dreams",
        "Constellations of stars\nMurals on city walls\nI don't see nobody but you",
        "You're my vice, \nyou're my muse\nYou're a nineteenth floor view\nI don't see nobody but you",
        "Girl, you got me\n hooked onto something\nWho could say that \nthey saw us coming?",
        "There's nothing\nLike doing nothing\nWith you",
        "Dumb conversations\nWe lose track of time\nHave I told you lately\nI'm grateful you're mine",
        "Be my only one,\n My only love",
        "Still with you",
        "And when we go crashing down, \nwe come back every time\n'Cause we never go out of style",
    ];

    function getRandomWord() {
        return wordList[randInt(wordList.length)];
    }

    function randInt(lessThan) {
        return Math.floor(Math.random() * lessThan);
    }

    // Create a count x count words with spherical distribution
    const words = useMemo(() => {
        const temp = [];
        const spherical = new THREE.Spherical();
        const phiSpan = Math.PI / (count + 1);
        const thetaSpan = (Math.PI * 2) / count;
        for (let i = 1; i < count + 1; i++)
            for (let j = 0; j < count; j++)
                temp.push([
                    new THREE.Vector3().setFromSpherical(
                        spherical.set(radius, phiSpan * i, thetaSpan * j)
                    ),
                    getRandomWord(),
                ]);
        return temp;
    }, [count, radius]);
    // eslint-disable-next-line react/no-children-prop
    return words.map(([pos, word], index) => <Word key={index} position={pos} children={word} />);
}

const JumpingImage = ({ imageSrc, onClick }) => {
    const [isJumping, setIsJumping] = useState(false);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setIsJumping((prev) => !prev);
        }, 500);
        return () => clearInterval(intervalId);
    }, []);

    return (
        <Image
            src={imageSrc}
            style={{
                position: "relative",
                top: isJumping ? "-50px" : "0",
                transition: "top 0.5s ease-in-out",
                height: "30%",
                width: "30%",
            }}
            onClick={onClick}
        />
    );
};

export default function Home() {
    const [isClicked, setIsClicked] = useState(false);
    const [audio, setAudio] = useState(null);

    useEffect(() => {
        setAudio(new Audio(ONLY));
    }, []);

    const playMusic = () => {
        setIsClicked(true);
        audio.play();
    };

    return (
        <>
            <Head>
                <title>for shan</title>
                
            </Head>
            {!isClicked ? (
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <Image src={LETTER} style={{ height: "90%", width: "90%", marginTop: 20 }} />
                    <JumpingImage imageSrc={BUNNY} onClick={playMusic} />
                    <fog attach="fog" args={["#202025", 0, 80]} />
                    <h3 style={{ fontSize: "1em", marginBottom: 20, fontFamily: "Arial" }}>
                        omg, what if i-click mo yung bunny?
                    </h3>
                </div>
            ) : (
                <Canvas
                    dpr={[1, 2]}
                    camera={{ position: [0, 0, 80], fov: 30 }}
                    style={{ height: "100vh" }}
                >
                    <fog attach="fog" args={["#202025", 0, 80]} />
                    <Cloud count={10} radius={35} />
                    <TrackballControls rotateSpeed={0.15} zoomSpeed={0.5} />
                </Canvas>
            )}
        </>
    );
}
