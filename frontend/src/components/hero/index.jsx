const Hero = () => {
    return (
        <section className="w-full max-w-[1320px] mx-auto h-auto flex flex-col items-center justify-center text-center py-20 px-6">
            <h1 className="text-[32px] sm:text-[40px] md:text-5xl font-weight-600 font-Poppins text-[#343434]">
                Discover & Register for Events That Inspire You.
            </h1>
            <p
                className="w-full sm:w-[500px] md:w-[678px] h-auto mt-6 
             font-poppins font-normal text-[18px] sm:text-[22px] md:text-[26px] leading-[160%] md:leading-[180%]
             text-[#343434] text-center"
            >
                From music festivals to tech meetups, find all<br className="hidden sm:block" />
                the events you love in one place. Sign up  <br className="hidden sm:block" />
                instantly and never miss out.
            </p>

            <button className="mt-8 w-[150px] sm:w-[178px] h-[45px] sm:h-[52px] rounded-[15px] border-[1.5px] border-[#F9FAFB] 
                         bg-[#007AFF] text-white font-medium text-base sm:text-lg flex items-center justify-center">
                Register Now!
            </button>

        </section>
    );
};

export default Hero;
