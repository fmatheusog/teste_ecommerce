using Teste.Shared.Enums;

namespace Teste.Shared;

public static class Extensions
{
    public static decimal GetDiscountAmount(this CustomerCategory customerCategory, decimal subTotal)
    {
        switch (customerCategory)
        {
            case CustomerCategory.REGULAR:
                return (subTotal > 500) ? subTotal * 0.05m : 0m;
            case CustomerCategory.PREMIUM:
                return (subTotal > 300) ? subTotal * 0.10m : 0m;
            case CustomerCategory.VIP:
                return subTotal * 0.15m;
            default:
                return 0m;
        }
    }
}
