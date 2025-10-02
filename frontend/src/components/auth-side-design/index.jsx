import avatar from '../../assets/avatar.jpeg';
import rating from '../../assets/rating.jpeg';
import trustpilot from '../../assets/trustpilot.jpeg';

const SideDesign = () => {
    return (
        <>
            <style>{`
        @media (max-width: 1027px) {
          .side-design {
            width: 537px !important;
          }
        }
      `}</style>

            <div className="side-design relative flex flex-col items-center justify-start bg-[#007AFF] p-6 lg:p-10 w-full lg:w-[613px] h-auto lg:h-[982px]">
                <h1 className="mt-8 lg:mt-10 font-poppins font-semibold text-[24px] lg:text-[28px] leading-[140%] lg:leading-[180%] tracking-[-0.02em] text-center text-white">
                    Join and Register for <br /> Events Easily
                </h1>
                <div className="hidden lg:block absolute top-[280px] w-[470px] h-[470px] bg-[#0F70DA] rounded-full opacity-70"></div>

                <div className="relative mt-12 lg:mt-40">
                    <img
                        src={avatar}
                        alt="user"
                        className="w-60 lg:w-80 h-60 lg:h-80 rounded-[20px] object-cover shadow-2xl border-4 border-white"
                    />
                    <img
                        src={rating}
                        alt="rating"
                        className="absolute -top-6 -right-6 w-28 lg:w-40 rounded-[16.25px]"
                    />
                    <div className="absolute -bottom-6 -left-6 flex items-center gap-2 bg-white px-3 py-2 rounded-lg shadow">
                        <img src={trustpilot} alt="trustpilot" className="w-20 lg:w-24" />
                    </div>
                </div>
            </div>
        </>
    )
}

export default SideDesign;
