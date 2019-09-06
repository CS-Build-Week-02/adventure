import React from "react";
import styled from "styled-components";

/**
 * Use a flex box anywhere you would use a div.
 * @param {boolean} justifyEnd Pushes content to end on main axis
 * @param {boolean} justifyBetween Evenly spaces content apart on main axis
 * @param {boolean} justifyAround Evenly spaces content apart with space around on main axis
 * @param {boolean} justifyCenter Centers content in flex box on main axis
 * @param {boolean} alignEnd Pushes content to end of off axis
 * @param {boolean} alignCenter Centers content on off axis
 * @param {boolean} wrap pushes Content to new line when content exceeds space of container
 * @param {boolean} wrapReverse Same as wrap but reversed
 * @param {string} width If value of "full" is provided the width is 100% otherwise it is the provided value
 * @param {string} maxWidth Max width is provided value
 * @param {string} height If value of "full" is provided the height is 100% otherwise it is the provided value
 * @param {string} spaceRight Defaults to 10px, otherwise it is the provided value
 * @param {string} spaceLeft Defaults to 10px, otherwise it is the provided value
 * @param {string} spaceBottom Defaults to 10px, otherwise it is the provided value
 * @param {string} spaceTop Defaults to 10px, otherwise it is the provided value
 * @param {string} flexGrow Specifies amount for child to grow. If no value is provided it is 1 otherwise it is the value provided
 * @param {string} background Specifies a background color. Color should be provided from color variables file as function. Defaults to transparent.
 */
export const FlexRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: ${props =>
  props.justifyEnd
    ? `flex-end`
    : props.justifyBetween
    ? `space-between`
    : props.justifyAround
      ? `space-around`
      : props.justifyCenter
        ? `center`
        : `flex-start`};
  align-items: ${props =>
  props.alignEnd ? `flex-end` : props.alignCenter ? `center` : `flex-start`};
  flex-wrap: ${props =>
  props.wrap ? `wrap` : props.wrapReverse ? `wrap-reverse` : `nowrap`};
  padding: ${props => (props.padding ? props.padding + "px" : "0")};
  width: ${props =>
  props.width ? (props.width === "full" ? "100%" : props.width) : "auto"};
  max-width: ${props => props.maxWidth};
  height: ${props =>
  props.height ? (props.height === "full" ? "100%" : props.height) : "auto"};
  margin-right: ${props =>
  ((g = props.spaceRight) => (g ? (g === true ? "10px" : g) : "0"))()};
  margin-left: ${props =>
  ((g = props.spaceLeft) => (g ? (g === true ? "10px" : g) : "0"))()};
  margin-bottom: ${props =>
  ((g = props.spaceBottom) => (g ? (g === true ? "10px" : g) : "0"))()};
  margin-top: ${props =>
  ((g = props.spaceTop) => (g ? (g === true ? "10px" : g) : "0"))()};
  margin: ${props =>
  ((g = props.spaceAround) => (g && g === true ? "10px" : g))()};
  flex-grow: ${props =>
  ((g = props.grow) => (g ? (parseFloat(g) > -1 ? g : "1") : "0"))()};
  flex-shrink: ${props => (props.shrink ? 1 : 0)};
  &&& {
    background: ${props => props.background || "transparent"};
  }
`;

/**
 * Use a flex box anywhere you would use a div.
 * @param {boolean} justifyEnd Pushes content to end on main axis
 * @param {boolean} justifyBetween Evenly spaces content apart on main axis
 * @param {boolean} justifyAround Evenly spaces content apart with space around on main axis
 * @param {boolean} justifyCenter Centers content in flex box on main axis
 * @param {boolean} alignEnd Pushes content to end of off axis
 * @param {boolean} alignCenter Centers content on off axis
 * @param {boolean} wrap pushes Content to new line when content exceeds space of container
 * @param {boolean} wrapReverse Same as wrap but reversed
 * @param {string} width If value of "full" is provided the width is 100% otherwise it is the provided value
 * @param {string} maxWidth Max width is provided value
 * @param {string} height If value of "full" is provided the height is 100% otherwise it is the provided value
 * @param {string} spaceRight Defaults to 10px, otherwise it is the provided value
 * @param {string} spaceLeft Defaults to 10px, otherwise it is the provided value
 * @param {string} spaceBottom Defaults to 10px, otherwise it is the provided value
 * @param {string} spaceTop Defaults to 10px, otherwise it is the provided value
 * @param {string} flexGrow Specifies amount for child to grow. If no value is provided it is 1 otherwise it is the value provided
 * @param {string} background Specifies a background color. Color should be provided from color variables file as function. Defaults to transparent.
 */
export const FlexColumn = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: ${props =>
  props.justifyEnd
    ? `flex-end`
    : props.justifyBetween
    ? `space-between`
    : props.justifyAround
      ? `space-around`
      : props.justifyCenter
        ? `center`
        : `flex-start`};
  align-items: ${props =>
  props.alignEnd ? `flex-end` : props.alignCenter ? `center` : `flex-start`};
  flex-wrap: ${props =>
  props.wrap ? `wrap` : props.wrapReverse ? `wrap-reverse` : `nowrap`};
  padding: ${props => (props.padding ? props.padding + "px" : "0")};
  width: ${props =>
  props.width ? (props.width === "full" ? "100%" : props.width) : "auto"};
  max-width: ${props => props.maxWidth};

  height: ${props =>
  props.height ? (props.height === "full" ? "100%" : props.height) : "auto"};
  margin-right: ${props =>
  ((g = props.spaceRight) => (g ? (g === true ? "10px" : g) : "0"))()};
  margin-left: ${props =>
  ((g = props.spaceLeft) => (g ? (g === true ? "10px" : g) : "0"))()};
  margin-bottom: ${props =>
  ((g = props.spaceBottom) => (g ? (g === true ? "10px" : g) : "0"))()};
  margin-top: ${props =>
  ((g = props.spaceTop) => (g ? (g === true ? "10px" : g) : "0"))()};
  margin: ${props =>
  ((g = props.spaceAround) => (g && g === true ? "10px" : g))()};
  flex-grow: ${props =>
  ((g = props.grow) => (g ? (parseFloat(g) > -1 ? g : "1") : "0"))()};
  flex-shrink: ${props => (props.shrink ? 1 : 0)};
  &&& {
    background: ${props => props.background || "transparent"};
  }
`;
