export const SearchLoading = ()=>{
     return (
        <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center gap-3">
            <div className="w-7 h-7 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin"></div>
            <span className="text-gray-700 font-medium ">Searching...</span>
        </div>
        </div>
    );
};

export default SearchLoading;