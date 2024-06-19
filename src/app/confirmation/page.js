'use client';
import { useRouter } from 'next/navigation';
import Layout from '../components/layout/page';

const ConfirmationPage = () => {
  const router = useRouter();
  const selectedParking = router.query?.selectedParking || 'Unknown'; // Default value or fallback if undefined

  return (
    <Layout>
      <div className="p-8">
        <h1 className="text-2xl font-bold">Confirm Parking Selection</h1>
        <p>You have selected parking space: {selectedParking}</p>
        {/* Additional confirmation UI can be added here */}
      </div>
    </Layout>
  );
};

export default ConfirmationPage;
