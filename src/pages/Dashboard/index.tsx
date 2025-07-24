import rocketAni from '../../assets/rocket.png';

export default function Docu() {
  return (
    <div className="h-[85vh] flex items-center justify-center">
      <div className="text-center">
        <img src={rocketAni} alt="Coming Soon" className="mx-auto mb-6 w-48"/>
        <h1 className="text-4xl font-bold text-gray-700">Coming Soon</h1>
      </div>
    </div>
  );
}
