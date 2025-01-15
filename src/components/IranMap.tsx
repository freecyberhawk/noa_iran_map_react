import React, {useState, useEffect} from 'react';

interface Props {
    data: { [key: string]: number };
    color?: string,
    backgroundColor?: string,
    tooltipLabel?: string,
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

const IranMap: React.FC<Props> = ({data, color = "#177a6e", backgroundColor = "#e8e8e8", tooltipLabel = "تراکم"}) => {
    const [svgContent, setSvgContent] = useState<string | null>(null);
    const [tooltip, setTooltip] = useState<{ x: number; y: number; value: number | null }>({x: 0, y: 0, value: null}); // وضعیت تول‌تیپ

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
        }}>
            {svgContent && (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox={"0 0 660 660"}
                    preserveAspectRatio={"xMidYMid meet"}
                    style={{
                        width: '100%',
                        height: '100%',
                    }}
                    dangerouslySetInnerHTML={{__html: updateSvgColors() || ""}}
                />
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
};

export default IranMap;
