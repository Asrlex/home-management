export default function FAB ({ icon, action, classes, ...props }) {
    return (
        <button
            onClick={action}
            className={classes}
        >
            {icon}
        </button>
    );
}