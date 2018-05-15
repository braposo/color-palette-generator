import React from "react";
import { render } from "react-dom";
import chroma from "chroma-js";

const isColour = hex => {
    try {
        const colour = chroma(hex);
        return true;
    } catch (e) {
        return false;
    }
};

const Colour = ({ baseColour, luminance }) => {
    if (!isColour(baseColour)) {
        return null;
    }

    const lum = luminance == null ? chroma(baseColour).luminance() : luminance;

    const colour = chroma(baseColour)
        .luminance(lum)
        .hex();

    return (
        <div
            style={{
                display: "inline-block",
                marginRight: 10,
                marginBottom: 5,
            }}
        >
            <div
                style={{
                    height: 50,
                    width: 100,
                    background: colour,
                }}
            />
            <div
                style={{
                    fontSize: 12,
                    fontFamily:
                        '-apple--system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
                }}
            >
                {colour}
            </div>
        </div>
    );
};

class App extends React.Component {
    state = { currentColour: null, baseColour: "#1DADF8" };

    updateBaseColour = e => {
        const newColour = e.target.value;
        this.setState({ baseColour: newColour });
    };

    updateColour = e => {
        if (this.state.baseColour == null || !isColour(this.state.baseColour)) {
            return null;
        }

        const luminance = chroma(this.state.baseColour).luminance();
        const [h, s, l] = chroma(this.state.baseColour).hsl();

        const colour = chroma
            .hsl(e.target.value, s, l)
            .luminance(luminance)
            .hex();

        this.setState({
            currentColour: colour,
        });
    };

    getRangeValue() {
        if (
            (this.state.baseColour == null &&
                this.state.currentColour == null) ||
            !isColour(this.state.baseColour)
        ) {
            return 0;
        }

        const colour = this.state.currentColour || this.state.baseColour;
        return parseFloat(chroma(colour).hsl()[0]).toFixed(0);
    }

    render() {
        const currentColour = this.state.currentColour || this.state.baseColour;
        const rangeValue = this.getRangeValue();
        const luminances = [
            0.87,
            0.74,
            0.58,
            0.45,
            0.37,
            0.24,
            0.14,
            0.08,
            0.04,
            0.02,
        ];

        return (
            <div>
                <h3>1. Select a base colour</h3>
                <input
                    onChange={this.updateBaseColour}
                    value={this.state.baseColour}
                />
                <div>
                    <Colour baseColour={this.state.baseColour} />
                </div>
                <h3>2. Rotate the hue value</h3>
                <input
                    type="range"
                    min="0"
                    max="360"
                    value={rangeValue}
                    onChange={this.updateColour}
                    style={{ width: 300 }}
                />
                <span>{rangeValue}</span>
                <h3>3.Compare palette against base</h3>
                <div>
                    {luminances.map(l => (
                        <Colour
                            baseColour={this.state.baseColour}
                            luminance={l}
                            key={`lum-${l}`}
                        />
                    ))}
                </div>
                <div style={{ marginTop: 50 }}>
                    {luminances.map(l => (
                        <Colour
                            baseColour={currentColour}
                            luminance={l}
                            key={`lum-${l}`}
                        />
                    ))}
                </div>
            </div>
        );
    }
}

render(<App />, document.getElementById("root"));
