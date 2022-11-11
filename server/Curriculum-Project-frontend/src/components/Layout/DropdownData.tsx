import {useState} from 'react';
import '../../styles/Dropdown.css'

const Dropdown_btn = (props: {children: JSX.Element, onChange: boolean, callBack: (isRotate: boolean) => void }) => {
    const [active, setActive] = useState(false);

    return (
        <div className="accordion-item">
            <i className="gg-play-button" onClick={() => setActive(!active)} />
            {props.callBack(active)}
            <div>
                {active && <div className="accordion-content">{props.children}</div>}
            </div>
        </div>
    )
}

export default Dropdown_btn;

