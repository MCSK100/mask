import styled from "styled-components"

export default function CyberButton({
  children,
  type = "button",
  onClick,
  className = "",
  disabled = false,
  fullWidth = false,
  tone = "dark"
}) {
  return (
    <Wrapper
      className={className}
      data-full-width={fullWidth ? "true" : "false"}
      data-tone={tone}
    >
      <button type={type} onClick={onClick} disabled={disabled}>
        <span className="label">{children}</span>
        <span className="clip">
          <span className="corner leftTop" />
          <span className="corner rightBottom" />
          <span className="corner rightTop" />
          <span className="corner leftBottom" />
        </span>
        <span className="arrow rightArrow" />
        <span className="arrow leftArrow" />
      </button>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: inline-flex;
  justify-content: center;
  width: fit-content;
  padding: 0 0.9rem;

  &[data-full-width="true"] {
    width: 100%;
  }

  &[data-full-width="true"] button {
    width: 100%;
  }

  &.cyber-btn--sm button {
    min-width: 9.5em;
    height: 3.2em;
    font-size: 11px;
  }

  button {
    --color: #3b82f6;
    --color-hover: #6366f1;
    --corner-color: #1d4ed8;
    --clip-shadow: #1e3a8a;
    position: relative;
    min-width: 11em;
    height: 3.5em;
    outline: none;
    transition: 0.1s;
    background-color: transparent;
    border: none;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: #ddebf0;
    padding: 0 1rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    white-space: nowrap;
  }

  .label {
    position: relative;
    z-index: 2;
  }

  .clip {
    position: absolute;
    top: 0;
    overflow: hidden;
    width: 100%;
    height: 100%;
    border: 4px double var(--color);
    box-shadow: inset 0 0 15px var(--clip-shadow);
    clip-path: polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%);
  }

  .arrow {
    position: absolute;
    transition: 0.2s;
    background-color: var(--color);
    top: 35%;
    width: 11%;
    height: 30%;
  }

  .leftArrow {
    left: -13.5%;
    clip-path: polygon(100% 0, 100% 100%, 0 50%);
  }

  .rightArrow {
    clip-path: polygon(100% 49%, 0 0, 0 100%);
    left: 102%;
  }

  button:hover .rightArrow {
    background-color: var(--color-hover);
    left: -15%;
    animation: rightArrow8 0.6s ease-in-out infinite alternate;
  }

  button:hover .leftArrow {
    background-color: var(--color-hover);
    left: 103%;
    animation: leftArrow8 0.6s ease-in-out infinite alternate;
  }

  .corner {
    position: absolute;
    width: 4em;
    height: 4em;
    background-color: var(--corner-color);
    box-shadow: inset 1px 1px 8px var(--color);
    transform: scale(1) rotate(45deg);
    transition: 0.2s;
  }

  .rightTop {
    top: -1.95em;
    left: 91%;
  }

  .leftTop {
    top: -1.96em;
    left: -3em;
  }

  .leftBottom {
    top: 2.1em;
    left: -2.15em;
  }

  .rightBottom {
    top: 45%;
    left: 88%;
  }

  button:hover .leftTop {
    animation: changeColor8 0.1s ease-in-out 0.05s both, lightEffect8 0.2s linear 0.4s both;
  }

  button:hover .rightTop {
    animation: changeColor8 0.1s ease-in-out 0.15s both, lightEffect8 0.2s linear 0.4s both;
  }

  button:hover .rightBottom {
    animation: changeColor8 0.1s ease-in-out 0.25s both, lightEffect8 0.2s linear 0.4s both;
  }

  button:hover .leftBottom {
    animation: changeColor8 0.1s ease-in-out 0.35s both, lightEffect8 0.2s linear 0.4s both;
  }

  button:hover .corner {
    transform: scale(1.25) rotate(45deg);
  }

  button:hover .clip {
    animation: greenLight8 0.2s ease-in-out 0.55s both;
    --color: var(--color-hover);
  }

  &[data-tone="dark"] button {
    --color: #475569;
    --color-hover: #8b5cf6;
    --corner-color: #334155;
    --clip-shadow: #0f172a;
  }

  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  @media (max-width: 640px) {
    padding: 0 0.55rem;

    button {
      min-width: 8.4em;
      height: 3.05em;
      font-size: 10px;
      letter-spacing: 0.14em;
      padding: 0 0.75rem;
    }

    &.cyber-btn--sm button {
      min-width: 8em;
      height: 2.95em;
      font-size: 10px;
      letter-spacing: 0.12em;
    }
  }

  @media (max-width: 380px) {
    padding: 0 0.35rem;

    button {
      min-width: 7.4em;
      height: 2.8em;
      font-size: 9px;
      letter-spacing: 0.08em;
      padding: 0 0.55rem;
    }

    .arrow {
      display: none;
    }

    .clip {
      border-width: 3px;
      clip-path: polygon(24% 0%, 76% 0%, 100% 24%, 100% 76%, 76% 100%, 24% 100%, 0% 76%, 0% 24%);
    }

    .corner {
      width: 2.8em;
      height: 2.8em;
    }
  }

  @keyframes changeColor8 {
    from { background-color: var(--corner-color); }
    to { background-color: var(--color-hover); }
  }

  @keyframes lightEffect8 {
    from { box-shadow: 1px 1px 5px var(--color-hover); }
    to { box-shadow: 0 0 2px var(--color-hover); }
  }

  @keyframes greenLight8 {
    to { box-shadow: inset 0 0 32px rgba(139, 92, 246, 0.5); }
  }

  @keyframes leftArrow8 {
    from { transform: translateX(0); }
    to { transform: translateX(10px); }
  }

  @keyframes rightArrow8 {
    from { transform: translateX(0); }
    to { transform: translateX(-10px); }
  }
`
