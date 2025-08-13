<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

/**
 * App\Models\Coupon
 *
 * @property int $id
 * @property string $code
 * @property string $name
 * @property string|null $description
 * @property string $type
 * @property string $value
 * @property string|null $minimum_amount
 * @property string|null $maximum_discount
 * @property int|null $usage_limit
 * @property int $usage_count
 * @property int|null $usage_limit_per_user
 * @property \Illuminate\Support\Carbon|null $starts_at
 * @property \Illuminate\Support\Carbon|null $expires_at
 * @property bool $is_active
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Product> $products
 * @property-read int|null $products_count
 * 
 * @method static \Illuminate\Database\Eloquent\Builder|Coupon newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Coupon newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Coupon query()
 * @method static \Illuminate\Database\Eloquent\Builder|Coupon whereCode($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Coupon whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Coupon whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Coupon whereExpiresAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Coupon whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Coupon whereIsActive($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Coupon whereMaximumDiscount($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Coupon whereMinimumAmount($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Coupon whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Coupon whereStartsAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Coupon whereType($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Coupon whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Coupon whereUsageCount($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Coupon whereUsageLimit($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Coupon whereUsageLimitPerUser($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Coupon whereValue($value)
 * @method static \Database\Factories\CouponFactory factory($count = null, $state = [])
 * 
 * @mixin \Eloquent
 */
class Coupon extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'code',
        'name',
        'description',
        'type',
        'value',
        'minimum_amount',
        'maximum_discount',
        'usage_limit',
        'usage_count',
        'usage_limit_per_user',
        'starts_at',
        'expires_at',
        'is_active',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'value' => 'decimal:2',
        'minimum_amount' => 'decimal:2',
        'maximum_discount' => 'decimal:2',
        'starts_at' => 'datetime',
        'expires_at' => 'datetime',
        'is_active' => 'boolean',
    ];

    /**
     * The products that belong to the coupon.
     */
    public function products(): BelongsToMany
    {
        return $this->belongsToMany(Product::class, 'coupon_products');
    }

    /**
     * Check if the coupon is valid for use.
     */
    public function isValid(): bool
    {
        if (!$this->is_active) {
            return false;
        }

        $now = now();

        if ($this->starts_at && $now->lt($this->starts_at)) {
            return false;
        }

        if ($this->expires_at && $now->gt($this->expires_at)) {
            return false;
        }

        if ($this->usage_limit && $this->usage_count >= $this->usage_limit) {
            return false;
        }

        return true;
    }

    /**
     * Calculate discount amount for a given total.
     */
    public function calculateDiscount(float $total): float
    {
        if (!$this->isValid()) {
            return 0;
        }

        if ($this->minimum_amount && $total < $this->minimum_amount) {
            return 0;
        }

        $discount = 0;

        if ($this->type === 'fixed') {
            $discount = (float) $this->value;
        } elseif ($this->type === 'percentage') {
            $discount = $total * ((float) $this->value / 100);
        }

        if ($this->maximum_discount && $discount > $this->maximum_discount) {
            $discount = (float) $this->maximum_discount;
        }

        return min($discount, $total);
    }
}