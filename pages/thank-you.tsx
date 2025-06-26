import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/router';

const ThankYouPage = () => {
  const router = useRouter();
  const { name } = router.query;

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-4">
        Dear {name ? name : "Customer"}, Your Order placed successfully!
      </h1>
      <p className="text-gray-600 mb-4">
        Your order has been received and will be processed shortly. You will pay cash on delivery.
      </p>
      <Link href="/">
        <Button>Order More</Button>
      </Link>
    </div>
  );
};

export default ThankYouPage;
