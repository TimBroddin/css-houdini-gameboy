import Gameboy from "./interface";
import rom from "data-url:./mario.gb";

function dataUriToBuffer(uri) {
  if (!/^data:/i.test(uri)) {
    throw new TypeError(
      '`uri` does not appear to be a Data URI (must begin with "data:")'
    );
  }

  // strip newlines
  uri = uri.replace(/\r?\n/g, "");

  // split the URI up into the "metadata" and the "data" portions
  const firstComma = uri.indexOf(",");
  if (firstComma === -1 || firstComma <= 4) {
    throw new TypeError("malformed data: URI");
  }

  // remove the "data:" scheme and parse the metadata
  const meta = uri.substring(5, firstComma).split(";");

  let charset = "";
  let base64 = false;
  const type = meta[0] || "text/plain";
  let typeFull = type;
  for (let i = 1; i < meta.length; i++) {
    if (meta[i] === "base64") {
      base64 = true;
    } else {
      typeFull += `;${meta[i]}`;
      if (meta[i].indexOf("charset=") === 0) {
        charset = meta[i].substring(8);
      }
    }
  }
  // defaults to US-ASCII only if type is not provided
  if (!meta[0] && !charset.length) {
    typeFull += ";charset=US-ASCII";
    charset = "US-ASCII";
  }

  // get the encoded data portion and decode URI-encoded chars
  const encoding = base64 ? "base64" : "ascii";
  const data = unescape(uri.substring(firstComma + 1));
  const buffer = Buffer.from(data, encoding);

  // set `.type` and `.typeFull` properties to MIME type
  buffer.type = type;
  buffer.typeFull = typeFull;

  // set the `.charset` property
  buffer.charset = charset;

  return buffer;
}

class GameboyPainter {
  constructor() {
    this.gb = new Gameboy();
    this.isPainting = false;
    //console.log(fetch);
    this.gb.loadRom(dataUriToBuffer(rom));
  }
  static get inputProperties() {
    return [
      "--frame",
      "--button-a",
      "--button-b",
      "--button-up",
      "--button-down",
      "--button-left",
      "--button-right",
      "--button-start",
      "--button-select",
    ];
  }

  propToVar(propName) {
    return propName.substr(2).replace(/-([a-z])/g, function (g) {
      return g[1].toUpperCase();
    });
  }

  parseProps(props) {
    const parsed = {};

    this.constructor.inputProperties.forEach((propName) => {
      parsed[this.propToVar(propName)] = this.parseProp(propName, props);
    });

    return parsed;
  }

  parseProp(propName, props) {
    const prop = props.get(propName);

    // Cater for browsers that don't speak CSS Typed OM and
    // for browsers that do speak it, but haven't registered the props
    if (
      typeof CSSUnparsedValue === "undefined" ||
      prop instanceof CSSUnparsedValue
    ) {
      if (!prop.length || prop === "") {
        return undefined;
      }
      switch (propName) {
        case "--frame":
          return parseInt(prop.toString());

        case "--button-a":
        case "--button-b":
        case "--button-up":
        case "--button-down":
        case "--button-left":
        case "--button-right":
        case "--button-start":
        case "--button-select":
          return parseInt(prop.toString());
        default:
          return prop.toString().trim();
      }
    }

    if (prop instanceof CSSUnparsedValue && !prop.length) {
      return undefined;
    }

    // Prop is a UnitValue (Number, Percentage, Integer, …)
    // ~> Return the value
    if (prop instanceof CSSUnitValue) {
      return prop.value;
    }

    // All others (such as CSSKeywordValue)
    //~> Return the string
    return prop.toString().trim();
  }

  paint(ctx, geom, props) {
    const SCALE = 2;

    const {
      buttonA,
      buttonB,
      buttonLeft,
      buttonRight,
      buttonUp,
      buttonDown,
      buttonStart,
      buttonSelect,
      frame: frameNumber,
    } = this.parseProps(props);

    //console.log(this.parseProps(props));
    const pressed = [];
    if (buttonA) {
      pressed.push("a");
    }
    if (buttonB) {
      pressed.push("b");
    }
    if (buttonLeft) {
      pressed.push("left");
    }

    if (buttonRight) {
      pressed.push("right");
    }
    if (buttonUp) {
      pressed.push("up");
    }
    if (buttonDown) {
      pressed.push("down");
    }
    if (buttonStart) {
      pressed.push("start");
    }
    if (buttonSelect) {
      pressed.push("select");
    }

    this.gb.pressKeys(pressed);

    if (!this.isPainting) {
      this.isPainting = true;
      const frame = this.gb.doFrame();
      for (let x = 0; x < 160; x++) {
        for (let y = 0; y < 144; y++) {
          const start = (x + y * 160) * 4;
          const r = frame[start];
          const b = frame[start + 1];
          const g = frame[start + 2];
          ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
          ctx.fillRect(x * SCALE, y * SCALE, SCALE, SCALE);
        }
      }
      this.isPainting = false;
    } else {
      ctx.clearRect(0, 0, geom.width, geom.height);
    }
  }
}

registerPaint("gameboy", GameboyPainter);
