export default function CartButton({ onClick, children }) {
    return (
        <button className="cart-button" onClick={onClick}>
            {children}
        </button>
    );
}