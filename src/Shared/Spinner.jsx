const Spinner = () => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-base-100/70 backdrop-blur-sm">
            <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
    );
};

export default Spinner;
