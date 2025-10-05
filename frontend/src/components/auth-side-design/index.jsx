import avatar from '../../assets/avatar.jpeg';
import rating from '../../assets/rating.jpeg';
import trustpilot from '../../assets/trustpilot.jpeg';

const SideDesign = () => {
    return (
        <div className="relative flex flex-col items-center justify-center bg-[#007AFF] p-6 lg:p-10 w-full h-full">
            <h1 className="mb-10 font-poppins font-semibold text-[24px] lg:text-[32px] leading-[140%] tracking-[-0.02em] text-center text-white">
                Join and Register for <br /> Events Easily
            </h1>

           <div className="relative flex items-center justify-center">
                <div className="absolute w-[300px] h-[300px] lg:w-[370px] lg:h-[370px] bg-[#0F70DA] rounded-full opacity-40"></div>
                <img
                    src={avatar}
                    alt="user"
                    className="relative z-10 w-48 lg:w-72 h-48 lg:h-72 rounded-[20px] object-cover shadow-2xl border-4 border-white"
                />
                <img
                    src={rating}
                    alt="rating"
                    className="absolute -top-6 -right-6 w-24 lg:w-32 rounded-[16.25px] z-20"
                />
                <div className="absolute -bottom-6 -left-6 flex items-center gap-2 bg-white px-3 py-2 rounded-lg shadow z-20">
                    <img src={trustpilot} alt="trustpilot" className="w-20 lg:w-24" />
                </div>
            </div>
        </div>
    );
};


export default SideDesign;
