import { describe, it, expect } from "vitest";
import { capitalisedNumberInWords, numberInWords } from "@/lib/number-words";

describe("numberInWords", () => {
  it("spells whole numbers the British way", () => {
    expect(numberInWords(0)).toBe("zero");
    expect(numberInWords(4)).toBe("four");
    expect(numberInWords(19)).toBe("nineteen");
    expect(numberInWords(42)).toBe("forty-two");
    expect(numberInWords(105)).toBe("one hundred and five");
    expect(numberInWords(1_005)).toBe("one thousand and five");
    expect(numberInWords(850_000)).toBe("eight hundred and fifty thousand");
    expect(numberInWords(8_240_000)).toBe("eight million two hundred and forty thousand");
    expect(numberInWords(1_450_315)).toBe("one million four hundred and fifty thousand three hundred and fifteen");
  });

  it("capitalises for the start of a sentence", () => {
    expect(capitalisedNumberInWords(4)).toBe("Four");
  });

  it("refuses what it cannot spell", () => {
    expect(() => numberInWords(-1)).toThrow(RangeError);
    expect(() => numberInWords(2.5)).toThrow(RangeError);
  });
});
