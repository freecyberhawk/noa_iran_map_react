"use client"
import React, {useState, useEffect} from 'react';
import "styles.css";

interface Props {
    data: { [key: string]: number };
    color?: string,
    backgroundColor?: string,
    tooltipLabel?: string,
    height?: string,
    listItems?: number,
    showListValue?: boolean,
    showListTitle?: boolean,
    fontSize?: "xs" | "sm" | "md" | "lg" | "xl",
    listStyle?: React.CSSProperties,
}

function getProvincePersianTitle(id: string) {
    const provinces = [
        {
            "title": "البرز",
            "id": "IR-32"
        },
        {
            "title": "کرمان",
            "id": "IR-15"
        },
        {
            "title": "سیستان و بلوچستان",
            "id": "IR-13"
        },
        {
            "title": "خراسان شمالی",
            "id": "IR-31"
        },
        {
            "title": "خراسان رضوی",
            "id": "IR-30"
        },
        {
            "title": "خراسان جنوبی",
            "id": "IR-29"
        },
        {
            "title": "کردستان",
            "id": "IR-16"
        },
        {
            "title": "گیلان",
            "id": "IR-19"
        },
        {
            "title": "کرمانشاه",
            "id": "IR-17"
        },
        {
            "title": "آذربایجان شرقی",
            "id": "IR-01"
        },
        {
            "title": "آذربایجان غربی",
            "id": "IR-02"
        },
        {
            "title": "قزوین",
            "id": "IR-28"
        },
        {
            "title": "زنجان",
            "id": "IR-11"
        },
        {
            "title": "همدان",
            "id": "IR-24"
        },
        {
            "title": "قم",
            "id": "IR-26"
        },
        {
            "title": "مرکزی",
            "id": "IR-22"
        },
        {
            "title": "اردبیل",
            "id": "IR-03"
        },
        {
            "title": "هرمزگان",
            "id": "IR-23"
        },
        {
            "title": "ایلام",
            "id": "IR-05"
        },
        {
            "title": "لرستان",
            "id": "IR-20"
        },
        {
            "title": "خوزستان",
            "id": "IR-10"
        },
        {
            "title": "چهارمحال و بختیاری",
            "id": "IR-08"
        },
        {
            "title": "یزد",
            "id": "IR-25"
        },
        {
            "title": "تهران",
            "id": "IR-07"
        },
        {
            "title": "سمنان",
            "id": "IR-12"
        },
        {
            "title": "مازندران",
            "id": "IR-21"
        },
        {
            "title": "گلستان",
            "id": "IR-27"
        },
        {
            "title": "فارس",
            "id": "IR-14"
        },
        {
            "title": "اصفهان",
            "id": "IR-04"
        },
        {
            "title": "بوشهر",
            "id": "IR-06"
        },
        {
            "title": "کهگیلویه و بویراحمد",
            "id": "IR-18"
        }
    ]
    const province = provinces.find((i: any) => i.id == id)
    return province?.title
}


function hexToRgb(hex: string) {
    hex = hex.replace(/^#/, '');

    if (hex.length === 3) {
        hex = hex.split('').map(x => x + x).join('');
    }
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    return [r, g, b];
}

export default function IranMap({
                                    data,
                                    color = "#177a6e",
                                    backgroundColor = "#e8e8e8",
                                    tooltipLabel = "تراکم",
                                    height = "100%",
                                    listItems = 5,
                                    showListValue = false,
                                    showListTitle = true,
                                    fontSize = "md",
                                    listStyle
                                }: Props) {
    const [svgContent, setSvgContent] = useState<string | null>(null);
    const [tooltip, setTooltip] = useState<{ x: number; y: number; value: number | null }>({x: 0, y: 0, value: null}); // وضعیت تول‌تیپ

    let length = Object.keys(data).length;
    if (length < listItems) {
        listItems = length
    }

    let NumberedFontSize = 0

    // convert fonts
    if (fontSize == 'xs') NumberedFontSize = 10
    if (fontSize == 'sm') NumberedFontSize = 12
    if (fontSize == 'md') NumberedFontSize = 14
    if (fontSize == 'lg') NumberedFontSize = 18
    if (fontSize == 'xl') NumberedFontSize = 20

    const sortedData = Object.entries(data)
        .sort(([, valueA], [, valueB]) => valueB - valueA) // Sort in descending order
        .slice(0, listItems); // Take the first 4 items

    let output = sortedData.map(([key, value]) => ({code: key, value}));

    const propsHeight = height


    const rgbDefaultColor = hexToRgb(color)

    const hoverColor = `rgba(${rgbDefaultColor[0]},${rgbDefaultColor[1]},${rgbDefaultColor[2]},0.4)`;
    const maxValue = Math.max(...Object.values(data))

    useEffect(() => {
        fetch("https://freecyberhawk.github.io/noa_iran_map_react/assets/iran.svg")
            .then((res) => res.text())
            .then((data) => setSvgContent(data))
            .catch((error) => console.error("Error loading SVG:", error));
    }, []);

    const getColorByValue = (value: number,) => {
        const intensity = 0.5 + (value / (maxValue * 2));
        return `rgba(${rgbDefaultColor[0]}, ${rgbDefaultColor[1]}, ${rgbDefaultColor[2]}, ${intensity})`;
    };


    const updateSvgColors = () => {
        if (!svgContent) return null;
        let updatedSvg = svgContent;


        const allPathsRegex = /<path[^>]*id="([^"]+)"[^>]*>/g;
        updatedSvg = updatedSvg.replace(allPathsRegex, (match, id) => {
            const value = data[id];
            const color = value
                ? getColorByValue(value)
                : backgroundColor;
            return match
                .replace(/fill="[^"]*"/, "")
                .replace(/\/?>/, ` fill="${color}" data-id="${id}" data-value="${value || 0}" style="cursor: pointer;" onmouseover="this.setAttribute('fill', '${hoverColor}')" onmouseout="this.setAttribute('fill', '${color}')" />`);
        });

        return updatedSvg;
    };

    const handleMouseMove = (event: React.MouseEvent) => {
        const target = event.target as SVGElement;
        const id = target.getAttribute("data-id");
        const value = target.getAttribute("data-value");

        if (id && value) {
            setTooltip({
                x: event.clientX + 12,
                y: event.clientY + 12,
                value: parseInt(value),
            });
        } else {
            setTooltip({x: 0, y: 0, value: null});
        }
    };

    return (
        <div onMouseMove={handleMouseMove} style={{
            position: "relative",
            direction: 'rtl'
        }}>
            {svgContent && (
                <div style={{
                    display: 'flex',
                    width: '100%',
                    height: propsHeight,
                    alignItems: 'center',
                    gap: 14
                }}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox={"0 0 660 660"}
                        preserveAspectRatio={"xMidYMid meet"}
                        style={{
                            width: 'auto',
                            height: propsHeight,
                        }}
                        dangerouslySetInnerHTML={{__html: updateSvgColors() || ""}}
                    />
                    <ul style={{listStyle: 'none', maxHeight: height, overflowY: 'scroll', scrollbarWidth: 'none',...listStyle}}>
                        {
                            showListTitle ? <li>
                                <p style={{fontSize: NumberedFontSize + 2, fontWeight: 'bold'}}>استان های کشور</p>
                            </li> : <></>
                        }
                        {
                            output.map((i: any) => (
                                <li style={{display: 'flex', alignItems: 'center', gap: 6, margin: "8px 0"}}>
                                    <span style={{
                                        width: 14,
                                        height: 14,
                                        borderRadius: '50%',
                                        backgroundColor: `${getColorByValue(i.value)}`
                                    }}></span>
                                    <p style={{fontSize: NumberedFontSize}}>{getProvincePersianTitle(i.code)}</p>
                                    {
                                        showListValue ?
                                            <p style={{
                                                fontSize: NumberedFontSize,
                                                marginLeft: '20px'
                                            }}>{i.value}</p> : <></>
                                    }
                                </li>
                            ))
                        }
                    </ul>
                </div>
            )}
            {tooltip.value !== null && (
                <div
                    style={{
                        position: "fixed",
                        top: tooltip.y + 2,
                        left: tooltip.x + 2,
                        backgroundColor: "rgba(0, 0, 0, 0.7)",
                        color: "#fff",
                        padding: "5px 10px",
                        borderRadius: "5px",
                        pointerEvents: "none",
                        fontSize: "12px",
                    }}
                >
                    {`${tooltipLabel}: ${tooltip.value}`}
                </div>
            )}
        </div>
    );
}
;

