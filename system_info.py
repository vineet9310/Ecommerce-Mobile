import psutil
import platform
import socket
import datetime

def get_size(bytes):
    """Convert bytes to human readable format"""
    for unit in ['B', 'KB', 'MB', 'GB', 'TB']:
        if bytes < 1024:
            return f"{bytes:.2f} {unit}"
        bytes /= 1024

def get_system_info():
    print("="*40, "System Information", "="*40)
    
    # System information
    uname = platform.uname()
    print(f"System: {uname.system}")
    print(f"Node Name: {uname.node}")
    print(f"Release: {uname.release}")
    print(f"Version: {uname.version}")
    print(f"Machine: {uname.machine}")
    print(f"Processor: {uname.processor}")
    
    # Boot Time
    boot_time = datetime.datetime.fromtimestamp(psutil.boot_time())
    print(f"\nBoot Time: {boot_time.strftime('%Y-%m-%d %H:%M:%S')}")
    
    # CPU information
    print("\n", "="*40, "CPU Information", "="*40)
    print(f"Physical cores: {psutil.cpu_count(logical=False)}")
    print(f"Total cores: {psutil.cpu_count(logical=True)}")
    cpu_freq = psutil.cpu_freq()
    print(f"Max Frequency: {cpu_freq.max:.2f}MHz")
    print(f"Min Frequency: {cpu_freq.min:.2f}MHz")
    print(f"Current Frequency: {cpu_freq.current:.2f}MHz")
    print("\nCPU Usage Per Core:")
    for i, percentage in enumerate(psutil.cpu_percent(percpu=True, interval=1)):
        print(f"Core {i}: {percentage}%")
    print(f"Total CPU Usage: {psutil.cpu_percent()}%")
    
    # Memory Information
    print("\n", "="*40, "Memory Information", "="*40)
    svmem = psutil.virtual_memory()
    print(f"Total: {get_size(svmem.total)}")
    print(f"Available: {get_size(svmem.available)}")
    print(f"Used: {get_size(svmem.used)}")
    print(f"Percentage: {svmem.percent}%")
    
    # Disk Information
    print("\n", "="*40, "Disk Information", "="*40)
    partitions = psutil.disk_partitions()
    for partition in partitions:
        print(f"\nDevice: {partition.device}")
        print(f"  Mountpoint: {partition.mountpoint}")
        print(f"  File system type: {partition.fstype}")
        try:
            partition_usage = psutil.disk_usage(partition.mountpoint)
            print(f"  Total Size: {get_size(partition_usage.total)}")
            print(f"  Used: {get_size(partition_usage.used)}")
            print(f"  Free: {get_size(partition_usage.free)}")
            print(f"  Percentage: {partition_usage.percent}%")
        except Exception:
            continue
    
    # Network information
    print("\n", "="*40, "Network Information", "="*40)
    print("Network Interfaces:")
    if_addrs = psutil.net_if_addrs()
    for interface_name, interface_addresses in if_addrs.items():
        print(f"\n{interface_name}:")
        for addr in interface_addresses:
            if addr.family == socket.AF_INET:
                print(f"  IPv4 Address: {addr.address}")
            elif addr.family == socket.AF_INET6:
                print(f"  IPv6 Address: {addr.address}")

if __name__ == "__main__":
    get_system_info()