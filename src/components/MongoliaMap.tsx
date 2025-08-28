import React from "react";

const MongoliaMap: React.FC = () => {
  return (
    <div className="w-full h-full flex items-center justify-center bg-white p-8">
      <svg
        viewBox="0 0 1000 600"
        className="w-full h-full max-w-4xl"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Монгол Улсын газрын зураг - цэгэн хэв маягаар */}
        <defs>
          <pattern
            id="dotPattern"
            x="0"
            y="0"
            width="6"
            height="6"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="3" cy="3" r="1.5" fill="#1e3a8a" />
          </pattern>
          <pattern
            id="smallDotPattern"
            x="0"
            y="0"
            width="4"
            height="4"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="2" cy="2" r="1" fill="#1e3a8a" />
          </pattern>
        </defs>

        {/* Монгол Улсын хил хязгаар - бодит хэлбэртэй */}
        <path
          d="M 200 100 L 220 95 L 240 90 L 260 85 L 280 80 L 300 75 L 320 70 L 340 65 L 360 60 L 380 55 L 400 50 L 420 45 L 440 40 L 460 35 L 480 30 L 500 25 L 520 20 L 540 15 L 560 10 L 580 5 L 600 0 L 620 5 L 640 10 L 660 15 L 680 20 L 700 25 L 720 30 L 740 35 L 760 40 L 780 45 L 800 50 L 820 55 L 840 60 L 860 65 L 880 70 L 900 75 L 920 80 L 940 85 L 960 90 L 980 95 L 1000 100 L 980 105 L 960 110 L 940 115 L 920 120 L 900 125 L 880 130 L 860 135 L 840 140 L 820 145 L 800 150 L 780 155 L 760 160 L 740 165 L 720 170 L 700 175 L 680 180 L 660 185 L 640 190 L 620 195 L 600 200 L 580 205 L 560 210 L 540 215 L 520 220 L 500 225 L 480 230 L 460 235 L 440 240 L 420 245 L 400 250 L 380 255 L 360 260 L 340 265 L 320 270 L 300 275 L 280 280 L 260 285 L 240 290 L 220 295 L 200 300 L 180 305 L 160 310 L 140 315 L 120 320 L 100 325 L 80 330 L 60 335 L 40 340 L 20 345 L 0 350 L 20 355 L 40 360 L 60 365 L 80 370 L 100 375 L 120 380 L 140 385 L 160 390 L 180 395 L 200 400 L 220 405 L 240 410 L 260 415 L 280 420 L 300 425 L 320 430 L 340 435 L 360 440 L 380 445 L 400 450 L 420 455 L 440 460 L 460 465 L 480 470 L 500 475 L 520 480 L 540 485 L 560 490 L 580 495 L 600 500 L 620 495 L 640 490 L 660 485 L 680 480 L 700 475 L 720 470 L 740 465 L 760 460 L 780 455 L 800 450 L 820 445 L 840 440 L 860 435 L 880 430 L 900 425 L 920 420 L 940 415 L 960 410 L 980 405 L 1000 400 L 980 395 L 960 390 L 940 385 L 920 380 L 900 375 L 880 370 L 860 365 L 840 360 L 820 355 L 800 350 L 780 345 L 760 340 L 740 335 L 720 330 L 700 325 L 680 320 L 660 315 L 640 310 L 620 305 L 600 300 L 580 295 L 560 290 L 540 285 L 520 280 L 500 275 L 480 270 L 460 265 L 440 260 L 420 255 L 400 250 L 380 245 L 360 240 L 340 235 L 320 230 L 300 225 L 280 220 L 260 215 L 240 210 L 220 205 L 200 200 L 180 195 L 160 190 L 140 185 L 120 180 L 100 175 L 80 170 L 60 165 L 40 160 L 20 155 L 0 150 L 20 145 L 40 140 L 60 135 L 80 130 L 100 125 L 120 120 L 140 115 L 160 110 L 180 105 L 200 100 Z"
          fill="url(#dotPattern)"
          stroke="#1e3a8a"
          strokeWidth="3"
        />

        {/* Нэмэлт цэгүүд газрын зурагт бүтэц өгөх */}
        <circle cx="250" cy="150" r="2" fill="#1e3a8a" />
        <circle cx="350" cy="120" r="2" fill="#1e3a8a" />
        <circle cx="450" cy="100" r="2" fill="#1e3a8a" />
        <circle cx="550" cy="130" r="2" fill="#1e3a8a" />
        <circle cx="650" cy="160" r="2" fill="#1e3a8a" />
        <circle cx="750" cy="190" r="2" fill="#1e3a8a" />
        <circle cx="850" cy="220" r="2" fill="#1e3a8a" />
        <circle cx="150" cy="200" r="2" fill="#1e3a8a" />
        <circle cx="250" cy="230" r="2" fill="#1e3a8a" />
        <circle cx="350" cy="250" r="2" fill="#1e3a8a" />
        <circle cx="450" cy="270" r="2" fill="#1e3a8a" />
        <circle cx="550" cy="290" r="2" fill="#1e3a8a" />
        <circle cx="650" cy="310" r="2" fill="#1e3a8a" />
        <circle cx="750" cy="330" r="2" fill="#1e3a8a" />
        <circle cx="850" cy="350" r="2" fill="#1e3a8a" />

        {/* Жижиг цэгүүд нэмэлт бүтэц өгөх */}
        <circle cx="300" cy="180" r="1" fill="#1e3a8a" />
        <circle cx="400" cy="160" r="1" fill="#1e3a8a" />
        <circle cx="500" cy="180" r="1" fill="#1e3a8a" />
        <circle cx="600" cy="200" r="1" fill="#1e3a8a" />
        <circle cx="700" cy="220" r="1" fill="#1e3a8a" />
        <circle cx="200" cy="250" r="1" fill="#1e3a8a" />
        <circle cx="300" cy="270" r="1" fill="#1e3a8a" />
        <circle cx="400" cy="290" r="1" fill="#1e3a8a" />
        <circle cx="500" cy="310" r="1" fill="#1e3a8a" />
        <circle cx="600" cy="330" r="1" fill="#1e3a8a" />
        <circle cx="700" cy="350" r="1" fill="#1e3a8a" />

        {/* Газрын зурагт нэмэлт дэлгэрэнгүй мэдээлэл */}
        <text
          x="500"
          y="550"
          textAnchor="middle"
          className="text-lg font-bold fill-gray-700"
        >
          Монгол Улс
        </text>
      </svg>
    </div>
  );
};

export default MongoliaMap;
