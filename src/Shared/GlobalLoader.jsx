import { useIsFetching, useIsMutating } from "@tanstack/react-query";
import Spinner from "./Spinner";

const GlobalLoader = () => {
    const isFetching = useIsFetching();
    const isMutating = useIsMutating();

    if (isFetching || isMutating) {
        return <Spinner />;
    }

    return null;
};

export default GlobalLoader;
